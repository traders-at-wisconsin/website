#!/usr/bin/env python3
"""
Regenerate app/data/campus.json — the geometry behind the homepage hero.

Queries OpenStreetMap via Overpass for the UW–Madison core campus, then
bakes street/footpath ways, building centroids and the Lake Mendota
shoreline into one small normalised JSON file.

The output is committed. Overpass is rate-limited and its uptime is not
our uptime, so the site never calls it at runtime; run this by hand if
the campus changes.

    python3 scripts/build-campus-data.py

Requires: requests. OSM data is ODbL — the attribution in the site
footer has to stay.
"""

import json
import math
import os
import sys
import urllib.parse
import urllib.request

OVERPASS = "https://overpass-api.de/api/interpreter"
OUT = os.path.join(os.path.dirname(__file__), "..", "app", "data", "campus.json")

# Core campus: Bascom Hill through the Union to the engineering campus.
LAT0, LAT1 = 43.0700, 43.0800
LON0, LON1 = -89.4160, -89.3950

ROT = math.radians(-7)      # tilt so the shoreline reads as a designed diagonal
RDP_EPS = 0.0016            # simplification tolerance, normalised units
MIN_WAY_LEN = 0.011         # drop crosswalk stubs and driveway spurs
MAX_SEG = 0.030             # resample cap — see note in resample()
MIN_BUILDING_AREA = 900     # m², drops sheds and kiosks
MAX_NODES = 88

HIGHWAY = (
    "^(motorway|trunk|primary|secondary|tertiary|unclassified|residential"
    "|living_street|service|pedestrian|footway|path|steps|cycleway)(_link)?$"
)
MAJOR = {
    "primary", "secondary", "tertiary", "residential", "unclassified",
    "living_street", "primary_link", "secondary_link", "trunk", "motorway",
}
CAMPUS_BUILDING = {
    "university", "dormitory", "college", "school", "sports_centre", "stadium",
}
SKIP_BUILDING = {"house", "garage", "detached", "apartments"}

# Buildings whose departments this club's subjects actually live in.
# The OSM name is on the left; "Computer Sceinces" is a typo upstream.
LABELS = {
    "Grainger Hall": "Grainger",
    "Computer Sceinces Building": "Computer Sciences",
    "Chamberlin Hall": "Chamberlin",
    "Sterling Hall": "Sterling",
    "Wisconsin Institute for Discovery": "Discovery",
    "Engineering Hall": "Engineering",
    "Memorial Library": "Memorial Library",
    "Washburn Observatory": "Washburn",
}


def overpass(query):
    body = urllib.parse.urlencode({"data": query}).encode()
    req = urllib.request.Request(
        OVERPASS, data=body, headers={"User-Agent": "traders-at-wisconsin-site/1.0"}
    )
    with urllib.request.urlopen(req, timeout=180) as r:
        return json.load(r)["elements"]


def project(lat, lon):
    """Equirectangular, corrected for latitude, then rotated.

    Over ~2 km any conformal projection is a similarity transform, so
    shape is preserved exactly. Using raw lat/lon as x/y would squash
    the campus 27% horizontally at this latitude.
    """
    k = math.cos(math.radians((LAT0 + LAT1) / 2))
    x = (lon - (LON0 + LON1) / 2) * k
    y = lat - (LAT0 + LAT1) / 2
    return (x * math.cos(ROT) - y * math.sin(ROT),
            x * math.sin(ROT) + y * math.cos(ROT))


def rdp(pts, eps):
    if len(pts) < 3:
        return pts
    (x1, y1), (x2, y2) = pts[0], pts[-1]
    dx, dy = x2 - x1, y2 - y1
    norm = math.hypot(dx, dy) or 1
    best, bi = -1, 0
    for i in range(1, len(pts) - 1):
        d = abs(dy * pts[i][0] - dx * pts[i][1] + x2 * y1 - y2 * x1) / norm
        if d > best:
            best, bi = d, i
    if best > eps:
        return rdp(pts[:bi + 1], eps)[:-1] + rdp(pts[bi:], eps)
    return [pts[0], pts[-1]]


def resample(pts, cap):
    """Split any segment longer than `cap` into equal pieces.

    Visually identical at rest — the inserted points are collinear. It
    matters for the draw-on: manim's partial-path is parameterised by
    segment index, not arc length, so without this a road spanning a
    third of the frame reveals in the same time as a three-metre stub
    and appears to whip across.
    """
    out = [pts[0]]
    for a, b in zip(pts, pts[1:]):
        n = max(1, math.ceil(math.hypot(b[0] - a[0], b[1] - a[1]) / cap))
        for k in range(1, n + 1):
            t = k / n
            out.append((a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t))
    return out


def polygon_area_m2(lats, lons):
    la = sum(lats) / len(lats)
    kx = 111320 * math.cos(math.radians(la))
    xs = [(x - lons[0]) * kx for x in lons]
    ys = [(y - lats[0]) * 110540 for y in lats]
    n = len(xs)
    return abs(sum(xs[i] * ys[(i + 1) % n] - xs[(i + 1) % n] * ys[i]
                   for i in range(n)) / 2)


def main():
    print("querying Overpass…")
    buildings = overpass(f"""
        [out:json][timeout:120][bbox:{LAT0},{LON0},{LAT1},{LON1}];
        way["building"];
        out geom;
    """)
    ways_raw = overpass(f"""
        [out:json][timeout:120][bbox:{LAT0},{LON0},{LAT1},{LON1}];
        way["highway"~"{HIGHWAY}"]["area"!~"yes"];
        out geom;
    """)
    lake = overpass("""
        [out:json][timeout:120];
        rel["natural"="water"]["name"="Lake Mendota"];
        out geom;
    """)
    print(f"  {len(buildings)} buildings, {len(ways_raw)} ways")

    nodes = []
    for e in buildings:
        tags, geom = e.get("tags", {}), e.get("geometry")
        if not geom:
            continue
        name, kind = tags.get("name"), tags.get("building")
        if not (kind in CAMPUS_BUILDING or (name and kind not in SKIP_BUILDING)):
            continue
        lats = [p["lat"] for p in geom]
        lons = [p["lon"] for p in geom]
        la, lo = sum(lats) / len(lats), sum(lons) / len(lons)
        if not (LAT0 <= la <= LAT1 and LON0 <= lo <= LON1):
            continue
        area = polygon_area_m2(lats, lons)
        if area < MIN_BUILDING_AREA:
            continue
        nodes.append({"p": project(la, lo), "a": area, "n": name})
    nodes.sort(key=lambda n: -n["a"])
    nodes = nodes[:MAX_NODES]

    ways = []
    for e in ways_raw:
        geom = e.get("geometry")
        if not geom or len(geom) < 2:
            continue
        if all(not (LAT0 - 0.001 <= p["lat"] <= LAT1 + 0.001
                    and LON0 - 0.002 <= p["lon"] <= LON1 + 0.002) for p in geom):
            continue
        tier = 1 if e.get("tags", {}).get("highway") in MAJOR else 0
        ways.append((tier, [project(p["lat"], p["lon"]) for p in geom]))

    # One shared normalisation across every layer. Scaling x and y
    # independently here would reintroduce the squash the projection
    # just removed.
    allpts = [n["p"] for n in nodes] + [p for _, w in ways for p in w]
    xs = [p[0] for p in allpts]
    ys = [p[1] for p in allpts]
    minx, maxx, miny, maxy = min(xs), max(xs), min(ys), max(ys)
    span = max(maxx - minx, maxy - miny)
    aspect = (maxx - minx) / (maxy - miny)
    norm = lambda p: ((p[0] - minx) / span, (p[1] - miny) / span)

    out_ways = []
    for tier, pts in ways:
        q = rdp([norm(p) for p in pts], RDP_EPS)
        length = sum(math.hypot(b[0] - a[0], b[1] - a[1])
                     for a, b in zip(q, q[1:]))
        if length < MIN_WAY_LEN:
            continue
        q = resample(q, MAX_SEG)
        out_ways.append([tier] + [round(v, 4) for p in q for v in p])

    shore = []
    for e in lake:
        if e["type"] != "relation":
            continue
        for mem in e.get("members", []):
            if mem.get("role") != "outer" or "geometry" not in mem:
                continue
            seg = [project(g["lat"], g["lon"]) for g in mem["geometry"]
                   if LAT0 - 0.02 <= g["lat"] <= LAT1 + 0.02
                   and LON0 - 0.03 <= g["lon"] <= LON1 + 0.03]
            if len(seg) > 3:
                shore.append(resample(rdp([norm(p) for p in seg], 0.0018), MAX_SEG))
    shore.sort(key=len, reverse=True)
    shore = shore[:2]

    r = lambda v: round(float(v), 4)
    data = {
        "aspect": round(aspect, 4),
        "nodes": [[r(norm(n["p"])[0]), r(norm(n["p"])[1]),
                   round(min(n["a"] / 9000, 1.0), 3)] for n in nodes],
        "ways": out_ways,
        "shore": [[[r(x), r(y)] for x, y in s] for s in shore],
        "labels": [{"i": i, "t": LABELS[n["n"]]}
                   for i, n in enumerate(nodes) if n["n"] in LABELS],
    }

    text = json.dumps(data, separators=(",", ":"))
    with open(OUT, "w") as f:
        f.write(text)

    verts = sum((len(w) - 1) // 2 for w in out_ways)
    longest = max(
        math.hypot(w[i + 2] - w[i], w[i + 3] - w[i + 1])
        for w in out_ways for i in range(1, len(w) - 3, 2)
    )
    print(f"wrote {os.path.relpath(OUT)}")
    print(f"  {len(data['nodes'])} nodes, {len(out_ways)} ways ({verts} vertices), "
          f"{len(data['labels'])} labels, aspect {data['aspect']}")
    print(f"  longest segment {longest * 100:.1f}% of width")
    print(f"  {len(text) / 1024:.0f} KB raw")


if __name__ == "__main__":
    sys.exit(main())

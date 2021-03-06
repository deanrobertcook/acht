---
title: Shapes
date: 2022-01-16
---

<iframe class="mx-auto" scrolling="no" width="640" height="360" src="code/particle3D/index.html"></iframe>

This page is not exactly coherent just yet. I'm just having some fun creating 2D and 3D animations and learning a bit of physics and math along the way - heavily inspired by the [Coding Train](https://thecodingtrain.com/).
## Bezier curves
### Finding the extremum
Bezier curves are defined by the anchor and control points around which the linear interpolation occurs. But what if we want to know exactly how much the curve itself buldges out? I.e, how would we find the maximum/minimum of the curve. Sticking to quadratic curves to make things easy:

<iframe class="mx-auto" scrolling="no" width="640" height="360" src="code/bezier_points/index.html"></iframe>

It turns out, after doing the derivation, that the extremum is always at the position `t = 0.5`. Or another way of putting it, the middle most point (or points) will the be the highest/lowest point on the curve. We can then just plug `0.5` into our bezier function to find it's value at that point.

Interestingly, if we draw a line from the point directly between the anchor points to the control point, the line seems to intersect our bezier curve at exactly the extrema (TODO - prove this).

## Brownian motion collision detection:
<iframe class="mx-auto" scrolling="no" width="640" height="360" src="code/quadtree/index.html"></iframe>

## Noise:
<iframe class="mx-auto" scrolling="no" width="640" height="360" src="code/1dNoise/index.html"></iframe>

## Diffusion-limited aggregation:
<iframe class="mx-auto" scrolling="no" width="640" height="360" src="code/quadtree-dla/index.html"></iframe>


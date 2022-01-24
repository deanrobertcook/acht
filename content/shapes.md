---
title: Shapes
date: 2022-01-16
---

<iframe class="mx-auto" scrolling="no" width="640" height="360" src="code/particle3D/index.html"></iframe>

This article is a deep dive into creating and animating shapes, with more of a focus on the underlying mathematics. 
## Bezier curves
### Finding the extremum
Bezier curves are defined by the anchor and control points around which the linear interpolation occurs. But what if we want to know exactly how much the curve itself buldges out? I.e, how would we find the maximum/minimum of the curve. Sticking to quadratic curves to make things easy:

<iframe class="mx-auto" scrolling="no" width="640" height="360" src="code/bezier_points/index.html"></iframe>

It turns out, after doing the derivation, that the extremum is always at the position `t = 0.5`. Or another way of putting it, the middle most point (or points) will the be the highest/lowest point on the curve. We can then just plug `0.5` into our bezier function to find it's value at that point.

Interestingly, if we draw a line from the point directly between the anchor points to the control point, the line seems to intersect our bezier curve at exactly the extrema (TODO - prove this).

## Noise:
<iframe class="mx-auto" scrolling="no" width="640" height="360" src="code/1dNoise/index.html"></iframe>


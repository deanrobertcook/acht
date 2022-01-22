---
title: Shapes
date: 2022-01-16
---

<div style="height: 500px" id="shapes"></div>

This article is a deep dive into creating and animating shapes, with more of a focus on the underlying mathematics. 
## Bezier curves
<div style="height: 500px" id="bezier"></div>

So, I started off trying to do this using three.js since I want to quickly get into making 3D animations, but for the sake of understanding some of the fundamentals, three's power comes with extra complexity (setting up cameras, understanding buffered geometries, etc.), which was getting in the way. 


### With p5.js
I'm a big fan of the [coding train](https://thecodingtrain.com/) and have wanted to follow along some of his courses for a while. He uses p5.js, so I dove in and turns out you can get 2D animations up with much less boiler plate code. They've done a really good job of making it user friendly, so let's stick to that for now:

<div style="height: 500px" id="bezier-p5"></div>

### Finding the extremum
Bezier curves are defined by the anchor and control points around which the linear interpolation occurs. But what if we want to know exactly how much the curve itself buldges out? I.e, how would we find the maximum/minimum of the curve. Sticking to quadratic curves to make things easy:

<div style="height: 500px" id="bezier-extremum"></div>

It turns out, after doing the derivation, that the extremum is always at the position `t = 0.5`. Or another way of putting it, the middle most point (or points) will the be the highest/lowest point on the curve. We can then just plug `0.5` into our bezier function to find it's value at that point.

Interestingly, if we draw a line between the middle of the curve and the control point, the line seems to intersect our bezier curve at exactly the extrema (TODO - prove this).





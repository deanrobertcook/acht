---
title: Shapes
date: 2022-01-16
---

This article is a deep dive into creating and animating shapes, with more of a focus on the underlying mathematics. 
## Bezier curves
<div style="height: 500px" id="bezier"></div>

So, I started off trying to do this using three.js since I want to quickly get into making 3D animations, but for the sake of understanding some of the fundamentals, three's power comes with extra complexity (setting up cameras, understanding buffered geometries, etc.), which was getting in the way. 


### With p5.js
I'm a big fan of the [coding train](https://thecodingtrain.com/) and have wanted to follow along some of his courses for a while. He uses p5.js, so I dove in and turns out you can get 2D animations up with much less boiler plate code. They've done a really good job of making it user friendly, so let's stick to that for now:

<div style="height: 500px" id="bezier-p5"></div>
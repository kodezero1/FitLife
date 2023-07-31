---
title: "Workout Log Guide"
dateCreated: "June 22, 2022"
lastUpdated: "June 23, 2022"
authorUsername: "George"
coverImg: "lift-club-guide/liftclub-main.jpeg"
readTime: "5 min"
summary: "An in-depth guide on how to read and use the Workout Log"
hidden: true
categories: "Guides"
---

# Log Page

The Log page is the main page of the app. This is where workouts will be selected and recorded.

## Date Bar

The Date Bar is at the top of the page, and it displays all dates with their respective day-of-the-week. The right-most day is the current day, and the bar scrolls to the left as far back as you can go

If no workout was recorded, that day will be colored grey. If a workout was recorded, the day will be colored blue.

## Quick Start

If you have not recorded a workout for the day, you will see the Quick Start Interface, where a variety of options are presented. The order of these options can be customized by dragging and dropping each of the three categories vertically into the order you prefer. Read more about each category below.

### On-The-Fly

"Start with a blank workout and track your exercises as you go."

These are perfect for spur-of-the-moment workouts, and they show how the workout system is implemented. When you select this option for the day's workout, you will be presented with the day's title as "On the Fly," and a prompt to add more execises. Click on the title "On the Fly" to change it to whatever you with to call the day's workout. Click on the "Add Exercise" button to select your exercises.

When you add an exercise, the exercise list will open up. At the top of the list is a search bar, which will search all available exercises by exercise name, muscle group (see below for all groups), muscle worked (e.g. triceps, quadriceps, rear deltoids, etc.), metric (weight, time, distance), or equipment used (e.g. barbell, cables, jumprope, etc.). To the right of the search bar is a button to add a "New Exercise." More information on that is below [New-Exercise](#new-exercise).

Muscle Groups:

- Upper Back
- Lower Back
- Shoulder
- Upper Arm
- Forearm
- Chest
- Hip
- Upper Leg
- Lower Leg
- Core
- Cardio

Below the search bar are two buttons, one for "All Exercises," and one for "My Exercises." "All Exercises" includes all exercises that are available to you. These are all of the public exercises on the app, combined with any exercises that you have made. The "My Exercises" tab only show the exercises you have made.

Below the search bar and the "All Exercises" and "My Exercises" buttons is the workout list. The list will show all workouts you filter for. For example, if you search for something, only relevant results will appear, or if you are on the "My Exercises" tab, only your exercises will appear. For now, let's say the search bar is blank, and we are on the "All Exercises" tab. In this case, all workouts that are available to you will be visible to you, one above another in bars. On the left hand side of each bar is the exercise's name, with one or more symbols just to the right of it. The first symbol is the metric used to measure the exercise. A dumbbell means it is measured in weight (lbs, kgs, etc.), a stopwatch means it is measured in time, and a ruler means it is measured in distance. If you created the exercise, an icon of a person's head and shoulders will be displyed. On the right hand side of the exercise bar, you will find a trash can if you created the bar - click it to delete the exercise permanently from the app's records. For all exercises, your's and public ones, you will find an informational "i" on the right most side; clicking it will expand the exercise bar and display further information about the exercise. Note that the search function looks for this information when you type into the search bar.

To add an exercise to the day's workout, click on the exercise bar. When it lights up in blue, it has been added to your workout for the day. Click on as many exercises as you wish to add. To remove an exercise from your workout, simply click on it again to deselect it - it should change from the highlighted blue to the original grey. Note that you can always add or remove exercises at any time during a workout. Also, they will appear in the order in which they were selected, but you can change this in the Workout Log.

When you are finished selecting your exercises for the day, swipe down on the list or click on the greyed out area just above it to close it. Now, you should be looking at the Workout Log again, but this time filled with the exercises you chose.

### Pre-Made Workouts

You can make or save pre-made workouts in the Workout Builder. Instead of doing an [On-The-Fly](#on-the-fly) Workout from scratch, you can simply click on one of the pre-made workouts to load it in exactly how you saved it. This is an excellent choice for within a routine or with a trainer, where your workouts are predetermined.

### Team Workouts

These work exactly like [Pre-Made Workouts](#pre-made-workouts), except they change based on what your team is doing. See the section on Teams for more information on how teams work.

## Using the Workout Log

The above three sections explain how to get started loading exercises into the Workout Log. But once you have exercises ready, what's next? Besides the obvious (_start working out!_) there are some more features you should know about. Let's start from the top.

On the top of the Workout Log, above the title, are two arrows on the left and right sides of the screen. These will move you forwards and backwards across the date bar, jumping to the most rescent workout. If you worked out everyday, this will be no different than clicking on the calendar days individually, but if your last workout was, say, two weeks ago, the left arrow will jump directly to that workout. The right arrow will do the same thing, but going forwards in time. Next to the right arrow is a copy button. This button will copy your workout to your clipboard as a JSON.

As mentioned in the [On-The-Fly](#on-the-fly) section, clicking in the workout's title will allow you to customize it.

Below the workout title is a section called "Muscles" with a variety of icons below it. These icons corespnod to the muscle groups that are being worked in your workout. For example, if you had the exercises squats and crunches selected, there would be an icon for Upper Leg and Core, since those are the two muscles groups being worked. Note that those groups are being pulled from the exercises details.

Below the icons comes the most important part of the app: the Workout Log. Each exercise in the log contains the same information, depending if it is measuring weight, time, or distance. We will cover the specifics of each type below. For all exercises, the exercise title will be displayed in the top left corner. Next to that is an icon of a graph. Click on the graph to see a detailed breakdown of your performance in that exercise over time. For more information on how to read and customize the graph, see the [Performance Chart](#performance-chart) section. On the top right side are two buttons, a "-" and "+". These will add or subtract sets from the exercise. When adding sets, the newly added set copies what was in the previous set for convenience. In the main portion of the exercise, the left most side shows the set number, starting from 1.

### Weight Exercises

To the right of the set number is the rep cout. In [On-The-Fly](#on-the-fly) workouts, it defaults to 0, and in [Pre-Made Workouts](#pre-made-workouts) it is whatever you saved the workout as. In anycase, you can click on it to edit it for the day's workout. To the right of the rep count is the weight. This is always left blank by default, but you can click on the blank space to fill it in. If you recorded this same exercises at least once, just to the right of the "weight" input is a column called "prev" for previous. This lists the last weight you entered for that set on this workout. For example, let's say you are doing parallel squats, and the last time you did that exercises was on Tuesday. For you weights, you did 50, 60, 70, 80. You are now hitting squats again on Friday. Your weight column will be blank, since you haven't started them yet, but your "prev" column will show 50. Once you add a second set, it will then say 60. As you add sets 3 and 4, it will add 70 and 80 below, since those were the last weights you used.

### Time Exercises

TODO

### Distance Exercises

TODO

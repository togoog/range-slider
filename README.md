# Description

Range slider is a ui component for selecting values (with any type) from predefined range (or from provided array).
Value(s) can be selected by dragging handle(s).

# Options

1. **value** Describe [Handle](#handle) positions on the [Track](#track). Each number corresponds to a [Handle](#handle) position. If you need to change the default Handle behaviour & appearence - provide object with Handle options for each Handle you want to adjust.   

+ (0)-----(40)----------(100)   => value: 40
+ (0)---(30)-----(70)---(100)   => value: [30, 70]
+ (0)-(10)---(50)--(80)-(100)   => value: [10, 50, 80]

2. **min** Range slider minimum value

3. **max** Range slider maximum value

4. **step** If provided [Handles](#handle) will move in descrete steps

5. **orientation** Display range slider horizontally or vertically

6. **padding** Limits how close to the slider edges [handles](#handle) can be.

7. **isDisabled** 

  If true - range slider is disabled. Value can only be changed programmatically. 
  
  If false - range slider is active. Value can be changed by interacting with UI and programmatically. 

8. **isPolifill**

  If true - range slider will execute only if there is no native range slider widget.

  If false - range slider will execute normally.

9. **cssPrefix** Prefix to be used with css classes.

10. **cssClasses** Common css classes.

11. **tooltips**

  true => show all tooltips (default)

  false => hide all tooltips

  [true, false, true] => show tooltips for first and last handle. Don't show tooltip for second handle

  [TooltipOptions, TooltipOptions, false] => Provide more options for 1st and 2nd tooltip. Don't show 3rd tooltip

12. **intervals**

  true => connect all handles 

  false => do not connect handles (default)

  [true, false] => connect 1st and 2nd handle. Do not connect 2nd and 3rd handle

  [IntervalOptions, false, IntervalOptions] => Provide more options for 1st and 3rd intervals. Do not connect 2nd and 3rd handle.

13. **grid**

  true => show grid (default)

  false => hide grid

  GridOptions => Provide more options for [grid](#grid)

# Components

## Track

Track is responsible for drawing the path withing which handles can be dragged.

### Track Options

1. **cssClasses** CSS Classes

## Interval

Interval is a part of track: 
* between track start and first handle
* between track end and last handle
* between neighbour handles

### Interval Options

1. **isVisible** 

  true => interval is rendered
  false => interval is not rendered

2. **isDraggable**

  true => can be dragged
  false => can not be dragged

3. **isDisabled**

  true => interval and 2 handle are disabled.
  false => active

4. **minLength** Can not shrink more then this value

5. **maxLenght** Can not expand more then this value

6. **cssClasses** CSS Classes

## Handle

Handle is a ui component that can be dragged along the track path to change range slider value.

### Handle Options

1. **value** Numeric value

2. **isDraggable**

  true => can be dragged

  false => can't be dragged

3. **isDisabled**

  true => is disabled

  false => is active

4. **respectConstraints**

  true => handle can't cross other handles

  false => handle can cross other handles

5. **snap**

  true => handle is tied to grid. (step option is not applied)
  
  false => handle is not tied to grid (handle use step option if it is set)

6. **cssClasses* CSS Classes

## Grid

Grid is a visual representation of the range of values along the track.

### Grid Options

1. **isVisible** 

  true => show grid

  false => hide grid

2. **formatter** Function that formats the labels 

3. **generator** Function that generates the sequence of numbers

4. **cssClasses** CSS classes

## Tooltip

Tooltip is a visual representation of handle value. It moves with handle.

### Tooltip Options

1. **isVisible**

  true => show tooltip

  false => hide tooltip

2. **formatter** Function to format the tooltip content

3. **cssClasses** CSS classes
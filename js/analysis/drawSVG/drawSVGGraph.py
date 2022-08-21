import os
import sys
import math

from collections import defaultdict

from drawSVG import SVG

#       *** To Do **
#   Don't plot lines that exceed a given min or max
#   Add commandline interface that allows options to be set
#   Fix axis positions for numbers < 0
#   Fix axis divisions for numbers < 1
#   Fix alignment when y-axis values are negatives or floats
#   Add tick marks to axes
#   Add data labels - with mouseover?
#   Fix text alignments when using different font-sizes?
#   Add series markers

class Graph(SVG):
    """ Plots series of (x,y) data on a SVG line graph. """
    
    def __init__(self, attributes=None):
        SVG.__init__(self, attributes)
        
        self.data = defaultdict(list)
        self.series = []
        self.second_series = []
        self.colours = ['green', '#0060e5', '#e52060', '#a00030', '#00c020', '#006010']
        
        self.left_pad  = 10
        self.right_pad = 16
        self.upper_pad = 10
        self.lower_pad = 10
        self.origin_x = self.left_pad
        self.origin_y = self.lower_pad
        
        # Set default values if not already defined
        self.attributes['width'] = self.attributes.get('width', 600)
        self.attributes['height'] = self.attributes.get('height', 400)
        
        # Axis options
        self.x_axis = True
        self.y_axis = True
        self.x_gridlines = True
        self.y_gridlines = True
        self.x_axis_units = True
        self.y_axis_units = True
        self.x_axis_label = None
        self.y_axis_label = None
        
        # These are automatically generated based on the data but can be overriden before plotting data
        self.min_x = None
        self.max_x = None
        self.div_x = None
        self.min_y = None
        self.max_y = None
        self.div_y = None

        self.format_x_ticks = None
        self.format_y_ticks = None
        
        self._addDefaultStyles()

    def _addDefaultStyles(self):
        """ Set default styles to style dictionary"""
    
        self.add_style('.background', {'fill':'none'})
        self.add_style('.axis', {'stroke': '#111', 'stroke-width': 1})
        self.add_style('.axis-label', {'font-size': '14px', 'font-family': 'Arial', 'text-anchor': 'middle'})
        self.add_style('.axis-units', {'font-size':'10px', 'font-family':'Arial'})
        self.add_style('.y-axis-text', {'text-anchor': 'end'})
        self.add_style('.x-axis-text', {'text-anchor': 'middle'})
        self.add_style('.gridlines', {'stroke':'black', 'stroke-width':0.3, 'fill':'none', 'opacity':0.5})
        self.add_style('.data-series', {'stroke-width':1.8, 'fill':'none', 'opacity':1})

    def addData(self, series_dict):
        """ Add a dictionary of data in the form of series_dict[name] = list_of_data. """
        
        for series_name, series_data in series_dict.items():
            self.series.append(series_name)
            self.data[series_name] = series_data

    def addDataFromFile(self, filename, limit=None):
        """ Read in a tab-delimited file with a heading row and add to self.data dictionary """
    
        try:
            fin = open(filename, 'r')
        except IOError:
            print("Could not open file",  filename)
            return
        
        self.series = fin.readline().rstrip().split('\t')
        
        for line in fin.readlines():
            values = line.rstrip('\n').split('\t')
            for i, series_name in enumerate(self.series):
                self.data[series_name].append(float(values[i]))

        if limit:
            for key, value in self.data.items():
                self.data[key] = value[:limit]

    def addDataToSecondAxis(self, series_name):
        try:
            idx = self.series.index(series_name)
        except ValueError:
            print('No such series {}'.format(series_name))
            return

        self.second_series.append(self.series[idx])
        del self.series[idx]

    def plot(self, *args):
        """ Given a list of series' names, plots those series with x values equal data indices i.e. 0 to len(data) - 1. """
    
        if not len(args):
            y_series = self.series
        else:
            y_series = args

        x_series = range(max(len(self.data[series]) for series in y_series))

        self._createGraph(x_series, y_series)
        
    def plot_x_on_y(self, x_series, *args):
        """ Given a list plots the first item in the list against all subsequent items in the list
            If not argument is passed then it plots the series """
    
        if not len(args):
            y_series = [series for series in self.series if series != x_series]
        else:
            y_series = args
        
        self._createGraph(self.data[x_series], y_series)

    def _createGraph(self, x_series, y_series):
        self._calculate_axis_properties(x_series, y_series)
        x_divisions = self._calculate_divisions(self.min_x, self.max_x, self.div_x)
        y_divisions = self._calculate_divisions(self.min_y, self.max_y, self.div_y)
        
        self._determine_plotting_functions(x_divisions, y_divisions)
        self._addBackground()
        self._addAxes()
        self._drawAxisUnits(x_divisions, y_divisions)
        self._drawGridlines(x_divisions, y_divisions)
        
        for i, series in enumerate(y_series):
            self._plotData(x_series, self.data[series], i)

    def _calculate_axis_properties(self, x_series, y_series):
        if self.min_x is None:
            self.min_x = min(x_series)
        if self.max_x is None:
            self.max_x = max(x_series)

        if self.min_y is None:
            self.min_y = min(min(self.data[series]) for series in y_series)
        if self.max_y is None:
            self.max_y = max(max(self.data[series]) for series in y_series)

        if not self.div_x:
            self.div_x = self._calculate_division_size(self.min_x, self.max_x)
        if not self.div_y:
            self.div_y = self._calculate_division_size(self.min_y, self.max_y)

        if not self.format_x_ticks:
            self.format_x_ticks = self._calculate_format_function(self.div_x)
        if not self.format_y_ticks:
            self.format_y_ticks = self._calculate_format_function(self.div_y)

    def _calculate_division_size(self, min_value=None, max_value=None):
        """ Calculate a nice number of divide an axis into """

        division_size = math.pow(10, int(math.log(max([max_value, -min_value]), 10)))
        if max_value / division_size > 5:
            division_size *= 2
        elif max_value / division_size < 1:
            division_size *= 0.2
        elif max_value / division_size < 3:
            division_size *= 0.5
        return division_size

    def _calculate_divisions(self, min_value=None, max_value=None, division_size=None):
        min_division = -int(math.ceil(-min_value / division_size))
        max_division = int(math.ceil(max_value / division_size))
        return [n * division_size for n in range(min_division, max_division + 1)]

    def _calculate_format_function(self, division_size):
        magnitude = math.floor(math.log(division_size, 10))
        if magnitude < 0:
            f = ':.{}f'.format(-magnitude)
            return lambda n: f.format(n)
        else:
            return lambda n: '{:d}'.format(n)

    def _determine_plotting_functions(self, x_divisions, y_divisions):
        """ Find where origin of graph should start and determine mapping from data to that region """
        
        # Make space for label if required
        if self.x_axis_label:
            self.origin_y += 20
        if self.y_axis_label:
            self.origin_x += 20
        
        # Make space for units if required
        if self.x_axis_units:
            self.origin_y += 12
        if self.y_axis_units:
            self.origin_x += 5 * max(len(self.format_y_ticks (y)) for y in y_divisions)
            # self.origin_x = 45
            
        self.chart_width  = self.attributes['width'] - self.right_pad - self.origin_x
        self.chart_height = self.attributes['height'] - self.upper_pad - self.origin_y
        x_scaling_factor = self.chart_width  * 1.0 / (x_divisions[-1] - x_divisions[0])
        y_scaling_factor = self.chart_height * 1.0 / (y_divisions[-1] - y_divisions[0])
        
        # Functions for converting x and y values into coordinates on the SVG
        self.f_x = lambda x: self.origin_x + x_scaling_factor * (x - x_divisions[0])
        self.f_y = lambda y: self.attributes['height'] - self.origin_y - y_scaling_factor * (y - y_divisions[0])

    def _addBackground(self):
        if self.children[0].children['.background'].get('fill', 'none') != 'none':
            self.addChildElement(
                'rect',
                {
                    'class': 'background',
                    'x':0,
                    'y':0,
                    'width': self.attributes['width'],
                    'height': self.attributes['height']
                }
            )

    def _addAxes(self):    
        if self.x_axis_label:
            x = 0.5 * (self.origin_x + self.attributes['width'] - self.right_pad)
            y = self.attributes['height'] - self.lower_pad
            self.addChildElement('text',
                                {'class':'axis-label',
                                 'x': x,
                                 'y': y},
                                 self.x_axis_label)

        if self.y_axis_label:
            x = self.left_pad
            y = 0.5 * (self.attributes['height'] - self.origin_y + self.upper_pad)
            self.addChildElement('text',
                                {'class':'axis-label', 'x': 0, 'y': y,
                                'transform': 'translate(%.1f) rotate(-90, 0, %.1f)' % (x+5, y)},
                                self.y_axis_label)

        # Add tick marks/values
        if self.x_axis:
            self.addChildElement('line',
                                {'class': 'axis',
                                'x1': self.origin_x,
                                'y1': self.attributes['height'] - self.origin_y,
                                'x2': self.attributes['width'] - self.right_pad + 1,
                                'y2': self.attributes['height'] - self.origin_y})

        if self.y_axis:
            self.addChildElement('line',
                                {'class': 'axis',
                                'x1': self.origin_x,
                                'y1': self.attributes['height'] - self.origin_y,
                                'x2': self.origin_x,
                                'y2': self.upper_pad})

    def _drawAxisUnits(self, x_divisions, y_divisions):
        if self.x_axis_units or self.y_axis_units:
            axis_group = self.addChildElement('g', {'class': 'axis-units'})
    
        if self.x_axis_units:
            x_group = axis_group.addChildElement('g', {'class': 'x-axis-text'})

            y = self.attributes['height'] - self.origin_y + 12
            for x in x_divisions:
                x_group.addChildElement(
                    'text',
                    { 'x': self.f_x(x), 'y': y },
                    self.format_x_ticks(x)
                )
        
        if self.y_axis_units:
            y_group = axis_group.addChildElement('g', {'class': 'y-axis-text'})
            
            x = self.origin_x - 3
            for y in y_divisions:
                y_group.addChildElement(
                    'text',
                    {'x': x, 'y': self.f_y(y) + 3 },
                    self.format_y_ticks(y)
                )

    def _drawGridlines(self, x_divisions, y_divisions):
        if self.x_gridlines or self.y_gridlines:
            gridline_group = self.addChildElement('g', {'class': 'gridlines'})

        if self.x_gridlines:
            for x in x_divisions[1:]:
                gridline_x = int(self.f_x(x)) + 0.5
                gridline_group.addChildElement('line',
                                               {'x1': gridline_x,
                                                'y1': self.attributes['height'] - self.origin_y,
                                                'x2': gridline_x,
                                                'y2': self.attributes['height'] - self.origin_y - self.chart_height})

        if self.y_gridlines:
            for y in y_divisions[1:]:
                gridline_y = int(self.f_y(y)) + 0.5
                gridline_group.addChildElement('line',
                                               {'x1': self.origin_x,
                                                'y1': gridline_y,
                                                'x2': self.origin_x + self.chart_width,
                                                'y2': gridline_y})

    def _plotData(self, x_data, y_data, series_n):
        """ Create <path> of straight lines for each series of data """
       
        # If there's too much data, such that there would be < 1 px between points on the chart
        # then bin the data
        bin_size = int(len(x_data) / self.chart_width)

        def bin_data(arr):
            max_n = math.floor(len(arr) / bin_size)
            return [float(sum(arr[n * bin_size:(n + 1) * bin_size])) / bin_size for n in range(max_n)]


        if bin_size > 1:
            x_data = bin_data(x_data)
            y_data = bin_data(y_data)

        # Filter to prevent drawing lines that exceed boundaries
        
        path = 'M' + ' '.join('%.1f,%.1f' % (self.f_x(x), self.f_y(y)) for x, y in zip(x_data, y_data))
        self.addChildElement('path', {'class': 'data-series', 'stroke': self.colours[series_n], 'd': path})

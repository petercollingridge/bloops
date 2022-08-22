import os
from drawSVG.draw_SVG_graph import Graph

width = 660
height = 300

def basic_sim(folder, filename):
    """ Graph population of food and creatures """

    data_file = os.path.join(folder, filename + '.txt')
    svg_file = os.path.join(folder, filename + '.svg')

    g = Graph({'width': width, 'height': height})
    g.add_data_from_file(data_file, limit=1000)
    g.div_x = 10000
    g.max_y = 700
    g.div_y = 100
    g.format_x_ticks = lambda n: "{}K".format(int(n / 1000)) if n else n
    g.x_axis_label = 'Time (ticks)'
    g.y_axis_label = 'Population size'
    g.plot_x_on_y('Time', 'Food', 'Creatures')

    g.add_label('Food', width - 20, 105, {'text-anchor': 'end', 'fill': g.colours[0]})
    g.add_label('Creatures', width - 20, 208, {'text-anchor': 'end', 'fill': g.colours[1]})

    g.output_to_file(svg_file)

if __name__ == '__main__':
    # basic_sim('bloops1', 'bloops1_initial')
    # basic_sim('bloops1', 'bloops1_stable')
    basic_sim('bloops1', 'bloops1_fast_food_2')

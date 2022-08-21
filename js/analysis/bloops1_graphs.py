import os
from drawSVG.draw_SVG_graph import Graph

def basic_sim(folder, filename):
    """ Graph population of food and creatures """

    data_file = os.path.join(folder, filename + '.txt')
    svg_file = os.path.join(folder, filename + '.svg')

    g = Graph({'width': 660, 'height': 300})
    g.add_data_from_file(data_file, limit=1000)
    g.div_x = 10000
    g.div_y = 100
    g.format_x_ticks = lambda n: int(n / 1000)
    g.x_axis_label = 'Time (1000 ticks)'
    g.y_axis_label = 'Population size'
    g.plot_x_on_y('Time', 'Food', 'Creatures')
    g.output_to_file(svg_file)

if __name__ == '__main__':
    basic_sim('bloops1', 'bloops1-100k-gen-basic')

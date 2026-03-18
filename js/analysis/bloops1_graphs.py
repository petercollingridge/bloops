import os
from drawSVG.draw_SVG_graph import Graph

WIDTH = 660
HEIGHT = 300

def basic_sim(folder, filename, **kwargs):
    """ Graph population of food and creatures """

    data_file = os.path.join(folder, filename + '.txt')
    svg_file = os.path.join(folder, filename + '.svg')

    g = Graph({'width': WIDTH, 'height': HEIGHT}, div_x=10000, **kwargs)
    g.add_data_from_file(data_file, limit=1000)
    if not g.series:
        return

    g.format_x_ticks = lambda n: f"{int(n / 1000)}K" if n else n
    g.x_axis_label = 'Time (ticks)'
    g.y_axis_label = 'Population size'
    g.plot_x_on_y('Time', 'Food', 'Creatures')

    g.add_label('Food', WIDTH - 20, 105, {'text-anchor': 'end', 'fill': g.colours[0]})
    g.add_label('Creatures', WIDTH - 20, 208, {'text-anchor': 'end', 'fill': g.colours[1]})

    g.output_to_file(svg_file)

if __name__ == '__main__':
    # basic_sim('bloops1', 'bloops1_initial')
    # basic_sim('bloops1', 'bloops1_stable')
    # basic_sim('bloops1', 'bloops1_fast_food_2', max_y=700, div_y=100)
    # basic_sim('bloops1', 'bloops1_big_world_slow')
    # basic_sim('bloops1', 'Bloops1_big_world')
    # basic_sim('bloops1', 'bloops_repro_2000')
    basic_sim('bloops1', 'data (12)')

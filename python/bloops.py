class Food:
    def __init__(self, position, energy):
        self.position = position
        self.energy = energy

        
class Creature:
    def __init__(self, position, energy, genome, energy):
        self.position = position
        self.energy = energy
        self.genome = genome

    def update(self):
        pass


class World:
    def __init__(self):
        self.creatures = []
        self.food = []

    def run(self, n):
        for _ in range(n):
            self.update()

    def update(self):
        for creature in self.creatures:
            creature.update()


if __name__ == '__main__':
    world = World()
    world.run(10000)
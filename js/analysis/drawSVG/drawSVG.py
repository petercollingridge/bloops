#   ***To do**
#   Allow multiple style elements with links to be added
#   Scripts
#   Prefered order for output
#   Automatic id generation
#   Get element by id


class SVG_Element:
    """ Generic element with attributes and potential child elements.
        Outputs as <type attribute dict> child </type>."""

    indent = 4

    def __init__(self, type, attributes=None, child=None):
        self.type = type

        if attributes:
            self.attributes = attributes
        else:
            self.attributes = {}

        if child is not None:
            self.children = [str(child)]
        else:
            self.children = []

    def addChildElement(self, tag, attributes=None, child=None):
        """
            Create an element with given tag type and atrributes,
            and append to self.children.
            Returns the child element.
        """

        child = SVG_Element(tag, attributes, child)
        self.children.append(child)
        return child

    def add(self, tag, attributes=None, child=None):
        child = SVG_Element(tag, attributes, child)
        self.children.append(child)
        return child

    def rect(self, x, y, width, height, **kwargs):
        kwargs['x'] = x
        kwargs['y'] = y
        kwargs['width'] = width
        kwargs['height'] = height

        child = SVG_Element('rect', kwargs)
        self.children.append(child)

        return child

    def text(self, text, x, y, **kwargs):
        kwargs['x'] = x
        kwargs['y'] = y

        child = SVG_Element('rect', kwargs, text)
        self.children.append(child)

        return child

    def output(self, nesting=0):
        indent = ' ' * nesting * self.indent

        svg_string = indent + '<%s' % (self.type)

        for key, value in self.attributes.items():
            svg_string += ' %s="%s"' % (key, value)

        if self.children is None:
            svg_string += '/>'
        else:
            svg_string += '>'

            new_line = False
            for child in self.children:
                if isinstance(child, SVG_Element):
                    svg_string += '\n' + child.output(nesting + 1)
                    new_line = True
                else:
                    svg_string += child

            if new_line:
                svg_string += '\n' + indent + '</%s>' % (self.type)
            else:
                svg_string += '</%s>' % (self.type)

        return svg_string


class SVG(SVG_Element):
    """ SVG element with style element and output that includes XML document string. """

    def __init__(self, attributes=None):
        SVG_Element.__init__(self, 'svg', attributes)
        self.attributes['xmlns'] = 'http://www.w3.org/2000/svg'

        style_element = SVG_Style_Element()
        self.styleDict = style_element.children
        self.children.append(style_element)

    def add_style(self, element, attributes):
        """
            Add style to element in self.style.children using a dictionary in
            form {selector: value}
        """

        if element not in self.styleDict:
            self.styleDict[element] = {}
        self.styleDict[element].update(attributes)

    def output_to_file(self, filename):
        """ Prints output to a given filename. Add a .svg extenstion if not given. """

        import os
        if not os.path.splitext(filename)[1] == '.svg':
            filename += '.svg'

        with open(filename, 'w') as f:
            f.write(self.output())

    def write(self, filename=None):
        """ Write output to file if given a filename, otherwise return output as a string. """

        if not filename:
            return self.output()
        else:
            self.output_to_file(filename)


class SVG_Style_Element(SVG_Element):
    def __init__(self):
        self.children = {}

    def output(self, nesting=None):
        if not self.children:
            return ''

        style_string = '\n<style>\n'

        for element, style in self.children.items():
            style_string += '  %s {\n' % element

            for key, value in style.items():
                style_string += '    %s: %s;\n' % (key, value)
            style_string += '  }\n'

        style_string += '  </style>\n'

        return style_string

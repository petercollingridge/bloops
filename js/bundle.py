"""
Very simple script to bundle all the JavaScript files imported in an index.html file into a single file.
This lets me load the JavaScript files in a single request, which is easier than loading them separately.
"""

import os


def get_script_filenames(filepath):
    """
    Given a path to an index.html file, return a list of filenames for the imported scripts.
    """

    filenames = []
    with open(filepath, 'r') as f:
        for line in f:
            if line.strip().startswith('<script src="'):
                full_path =line.split('"')[1]
                i = full_path.index('src/') + 4
                filenames.append(full_path[i:])
    return filenames


def bundle_scripts(filenames, output_filename):
    """
    Given a list of script filenames run a bash script to concatenate them into a single file with
    the given output filename.
    """

    with open(output_filename, "w") as outfile:
        for filename in filenames:
            with open(filename) as infile:
                outfile.write(infile.read())
                outfile.write("\n")


if __name__ == '__main__':
    filename = 'index-1.html'
    script_folder = 'src'

    filepath = os.path.join('examples', filename)
    filenames = get_script_filenames(filepath)
    filepaths = [os.path.join(script_folder, filename) for filename in filenames]

    bundle_scripts(filepaths, 'bundle-1.js')

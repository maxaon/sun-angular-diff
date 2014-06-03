# !/usr/bin/env python
from __future__ import print_function
from argparse import ArgumentParser
import os
import re

parser = ArgumentParser(description="Create template file in templateCache")
parser.add_argument("-f", "--file", help="File to be read and translated")
parser.add_argument("-n", "--name", help="Name of created template")

parser.add_argument("-d", "--dir", "--directory", help="Directory from which start searching")
parser.add_argument("-o", "--output", help="Destination file or pattern")
parser.add_argument("-e", "--extension", default=".tpl.html", help="File re")

parser.add_argument("--regexp",
                    default="^[\t ]*templateUrl:[\t ]*(?P<jscode>[\w.]*)[\t ]+[\t ]*(['\"]*)(?P<name>.*)\\2[\t ,]*$",
                    help="Python regular expression to find desired path")
parser.add_argument("--module-name", default="templateCache", help="Name of created module")

template = """(function (angular) {{
    'use strict';
    var module=angular.module("{modulename}");
    module.run(['$templateCache', function($templateCache) {{
{templates}
    }}]);\n}}(window.angular));"""


def find_file_names(regexp, text):
    assert not isinstance(regexp, basestring)
    names = []
    for match in regexp.finditer(text):
        groups = match.groupdict()
        if not groups['jscode']:
            names.append(groups['name'])
        elif groups['jscode'] == "module.name":
            raise NotImplementedError
        else:
            raise NotImplementedError("JS code not supported")
    return names


def extract_name_from_dir(start_dir, regexp, desired_part):
    file_names = os.listdir(start_dir)
    for file_name in file_names:
        if file_name.endswith(".js") and not file_name.endswith(".html.js") and not file_name.endswith(".tpl.js"):
            path = os.path.join(start_dir, file_name)
            with open(path) as content_file:
                content = content_file.read()
                names = find_file_names(regexp, content)
                for name in names:
                    if desired_part in name:
                        return name


def process_template(template_file, regexp):
    template_directory = os.path.abspath(os.path.dirname(template_file))
    name = extract_name_from_dir(template_directory, regexp, os.path.basename(template_file))
    if not name:
        with open(template_file) as file:
            first_line = file.readline()
        match = re.match('<!--\sname=[\'"](.*?)[\'"].*-->', first_line)
        if match:
            name = match.groups()[0]
    if not name:
        name = os.path.basename(template_directory) + "/" + os.path.basename(template_file)

    with open(template_file) as raw_template_file:
        raw_template = raw_template_file.read()
    raw_template = raw_template.replace("\n", "\\n").replace("'", "\\'")
    return "\t\t$templateCache.put('{name}','{template}');".format(name=name, template=raw_template)


def main(args):
    regexp = re.compile(args.regexp, flags=re.MULTILINE | re.UNICODE)
    processed_templates = ""
    if args.file:
        processed_templates = process_template(args.file, regexp)
    else:
        for root, dirs, files in os.walk(args.dir or os.getcwd()):
            for file_name in files:
                if file_name.endswith(args.extension):
                    processes_template = process_template(os.path.join(root, file_name), regexp)
                    if args.output and "*" in args.output:
                        result = template.format(modulename=args.module_name, templates=processes_template)
                        try:
                            result_name = args.output.replace("*", file_name[:file_name.rindex(".")])
                        except ValueError:
                            result_name = args.output.replace("*")
                        with open(os.path.join(root, result_name), "w") as output_file:
                            output_file.write(result)
                    else:
                        processed_templates += processes_template + "\n"

    if not args.output:
        result = template.format(modulename=args.module_name, templates=processed_templates)
        print(result)
    elif "*" not in args.output:
        result = template.format(modulename=args.module_name, templates=processed_templates)
        with open(args.output, "w") as output_file:
            output_file.write(result)


if __name__ == "__main__":
    main(args=parser.parse_args())

import argparse

my_parser = argparse.ArgumentParser()
my_parser.add_argument('--type', action='store', type=string)
my_parser.add_argument('--audio', action='store', type=string, required=True)

args = my_parser.parse_args()

print(args.input)
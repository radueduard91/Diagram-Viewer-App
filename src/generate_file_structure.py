import os

def generate_file_structure(path, output_file):
    with open(output_file, 'w', encoding='utf-8') as f:
        for root, dirs, files in os.walk(path):
            level = root.replace(path, '').count(os.sep)
            indent = ' ' * 4 * level
            f.write(f'{indent}{os.path.basename(root)}/\n')
            subindent = ' ' * 4 * (level + 1)
            for file in files:
                f.write(f'{subindent}{file}\n')

if __name__ == '__main__':
    current_directory = os.path.dirname(os.path.abspath(__file__))
    output_filename = os.path.join(current_directory, 'file_structure.txt')
    generate_file_structure(current_directory, output_filename)
    print(f"File structure written to {output_filename}")

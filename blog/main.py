import os
from pathlib import Path
from PIL import Image

def convert_to_webp():
    # Get the directory where the script is located
    current_dir = Path(__file__).parent
    
    # Supported extensions
    extensions = ('.jpg', '.jpeg', '.png')
    
    print(f"Scanning for images in: {current_dir}\n")

    for file_path in current_dir.iterdir():
        # Check if file is a jpg or png
        if file_path.suffix.lower() in extensions:
            try:
                # Open the image
                img = Image.open(file_path)
                
                # Define the new filename
                new_filename = file_path.with_suffix('.webp')
                
                # Save as WebP
                # quality=80 is a good balance, lossless=True is an option for PNGs
                img.save(new_filename, format="webp", quality=80)
                
                print(f"Converted: {file_path.name} -> {new_filename.name}")
            except Exception as e:
                print(f"Failed to convert {file_path.name}: {e}")

    print("\nConversion complete!")

if __name__ == "__main__":
    convert_to_webp()
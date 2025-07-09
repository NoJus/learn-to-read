# Learn to Read - Lithuanian Words

A web application designed to help users learn Lithuanian words through an interactive card-based interface.

## Features

- **Word Cards**: Display simple Lithuanian words, one per card
- **Multiple Navigation Methods**:
  - Dots navigation below the card
  - Arrow buttons below the dots navigation
  - Swipe gestures (left and right)
  - Keyboard navigation (arrow keys)
- **Audio Pronunciation**: Speaker icon in the top right corner that reads the word when pressed

## How to Use

1. **Open the application**: Simply open `index.html` in your web browser
2. **Navigate between words**:
   - Click the dots below the card to jump to a specific word
   - Use the arrow buttons to move forward/backward
   - Swipe left/right on the card (mobile devices)
   - Use arrow keys on your keyboard
3. **Listen to pronunciation**: Click the speaker icon in the top right corner
4. **Keyboard shortcuts**:
   - Left Arrow: Previous word
   - Right Arrow: Next word
   - Spacebar: Play pronunciation

## Technical Details

- **Framework**: Bootstrap 5.3.0
- **Icons**: Font Awesome 6.4.0
- **Audio**: Web Speech API for pronunciation
- **Responsive Design**: Mobile-first approach
- **Touch Support**: Swipe gestures for mobile devices

## Browser Compatibility

The application works best in modern browsers that support:
- Web Speech API (for audio pronunciation)
- Touch events (for swipe gestures)
- CSS animations and transitions

## File Structure

```
learn-to-read/
├── index.html          # Main HTML file
├── styles.css          # Custom CSS styles
├── script.js           # JavaScript functionality
├── docs/
│   └── specs.md        # Project specifications
└── README.md           # This file
```

## Customization

### Adding New Words

To add new Lithuanian words, edit the `words` array in `script.js`:

```javascript
this.words = [
    'Labas',
    'Ačiū',
    // Add your new words here
    'Naujas žodis'
];
```

### Styling

The application uses Bootstrap for styling with custom CSS in `styles.css`. You can modify the appearance by editing the CSS file.

## Development

The application is built with vanilla JavaScript and doesn't require any build process. Simply open `index.html` in a web browser to run it.

## License

This project is open source and available under the MIT License. 
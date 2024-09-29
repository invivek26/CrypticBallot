// Pin definitions
const int redLedPin = 12;      // Red LED connected to pin 12
const int redButtonPin = 13;   // Red button connected to pin 13
const int blueLedPin = 10;     // Blue LED connected to pin 10
const int blueButtonPin = 8;   // Blue button connected to pin 8

int redVotes = 0;              // Counter for red votes
int blueVotes = 0;             // Counter for blue votes

void setup() {
  pinMode(redLedPin, OUTPUT);
  pinMode(blueLedPin, OUTPUT);
  

  pinMode(redButtonPin, INPUT_PULLUP);
  pinMode(blueButtonPin, INPUT_PULLUP);

  Serial.begin(9600);
}

void loop() {
  int redButtonState = digitalRead(redButtonPin);
  int blueButtonState = digitalRead(blueButtonPin);

  if (redButtonState == LOW) {
    redVotes++;  // Increment red vote count
    Serial.println("Vote registered for Red!");
    Serial.print("Total Red Votes: ");
    Serial.println(redVotes);
    
    Serial.print("Total Votes: ");
    Serial.println(redVotes + blueVotes);

    digitalWrite(redLedPin, HIGH);
    delay(500);
    digitalWrite(redLedPin, LOW);

    Serial.println("Play Sound");
    delay(500);  // Delay to avoid multiple counts for one press
  }

  // If blue button is pressed
  if (blueButtonState == LOW) {
    blueVotes++;  // Increment blue vote count
    Serial.println("Vote registered for Blue!");
    Serial.print("Total Blue Votes: ");
    Serial.println(blueVotes);
    
    // Send total votes to serial
    Serial.print("Total Votes: ");
    Serial.println(redVotes + blueVotes);

    // Blink the blue LED
    digitalWrite(blueLedPin, HIGH);
    delay(500);
    digitalWrite(blueLedPin, LOW);

    // Trigger sound
    Serial.println("Play Sound");
    delay(500);  // Delay to avoid multiple counts for one press
  }

  delay(100); // Debounce delay to avoid multiple readings
}


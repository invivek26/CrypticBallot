import serial
import sys
import pygame
import imageio
import numpy as np
import requests
import uuid

def vote(color):
    uid = str(uuid.uuid4())

    url = 'http://192.168.67.119:8888/vote'

    data = {
        "uid": uid,
        "color": color
    }

    response = requests.post(url,json=data)

    if response.status_code == 200:
        print("Vote Registered!")
    else:
        print("Vote failed to registered!")

# Initialize pygame
pygame.init()

# Set up display
width, height = 800, 600
screen = pygame.display.set_mode((width, height))
pygame.display.set_caption("Vote Counter")

# Colors
background_color = (30, 30, 30)  # Dark background
text_color = (255, 255, 255)  # White text
font_size = 72
small_font_size = 36

sound1 = pygame.mixer.Sound('/Users/shreyashsingh/Downloads/registering.mp3')

tick_img = pygame.image.load('/Users/shreyashsingh/Downloads/secure.png')
tick_img = pygame.transform.scale(tick_img, (20, 20))  #

# Initialize serial connection
ser = serial.Serial('/dev/tty.usbmodem1101', 9600)

# Vote counters
total_votes = 0
total_red_votes = 0
total_blue_votes = 0


font = pygame.font.Font(None, font_size)
small_font = pygame.font.Font(None, small_font_size)


def load_gif(filename):
    gif = imageio.mimread(filename)
    gif_frames = []
    for i, frame in enumerate(gif):

        print(f"Frame {i} shape: {frame.shape}")  # Debugging output


        try:
            frame_surface = pygame.surfarray.make_surface(np.transpose(frame, (1, 0, 2)))
            gif_frames.append(frame_surface)
        except Exception as e:
            print(f"Error processing frame {i}: {e}")  # Error handling

    return gif_frames


def display_gif(gif_frames, surface, position):
    for frame in gif_frames:
        surface.blit(frame, position)
        pygame.display.flip()
        pygame.time.delay(100)  # Control the speed of the GIF



def draw_gradient():
    """Create a moving gradient background."""
    for i in range(height):
        color = (0, 50 + (i * 205 // height), 100 + (i * 155 // height))
        pygame.draw.line(screen, color, (0, i), (width, i))

def display_votes(vote_color=None):
    screen.fill(background_color)  # Fill background

    # Top half for total votes
    top_half_rect = pygame.Rect(0, 0, width, height // 2)
    pygame.draw.rect(screen, (50, 50, 50), top_half_rect)  # Background color for top half

    # Display total votes in top half
    vote_text = font.render(f"Total Votes: {total_votes}", True, text_color)
    text_rect = vote_text.get_rect(center=(width // 2, height // 4))
    screen.blit(vote_text, text_rect)

    # Bottom half for color split
    bottom_half_rect_blue = pygame.Rect(0, height // 2, width // 2, height // 2)
    bottom_half_rect_red = pygame.Rect(width // 2, height // 2, width // 2, height // 2)

    pygame.draw.rect(screen, (0, 0, 255), bottom_half_rect_blue)  # Blue background
    pygame.draw.rect(screen, (255, 0, 0), bottom_half_rect_red)  # Red background

    blue_votes_text = small_font.render(f"Total Blue Votes: {total_blue_votes}", True, text_color)
    blue_votes_rect = blue_votes_text.get_rect(center=(width // 4, height * 3 // 4 - 20))
    screen.blit(blue_votes_text, blue_votes_rect)

    red_votes_text = small_font.render(f"Total Red Votes: {total_red_votes}", True, text_color)
    red_votes_rect = red_votes_text.get_rect(center=(3 * width // 4, height * 3 // 4 - 20))
    screen.blit(red_votes_text, red_votes_rect)

    connection_strip_rect = pygame.Rect(0, height - 40, width, 40)
    pygame.draw.rect(screen, (40, 40, 40), connection_strip_rect)  # Background for connection status

    connection_status_text = small_font.render("Connection: Secure", True, text_color)
    connection_status_rect = connection_status_text.get_rect(center=(width // 2, height - 20))
    screen.blit(connection_status_text, connection_status_rect)

    screen.blit(tick_img, (connection_status_rect.right + 10, connection_status_rect.top))

    if vote_color:
        registered_text = small_font.render(f"Vote registered for {vote_color}!", True, text_color)
        registered_rect = registered_text.get_rect(center=(width // 2, height // 4 + 100))
        screen.blit(registered_text, registered_rect)

    pygame.display.flip()  # Update the display

# Initial display
display_votes()

while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

    # Create moving background effect
    draw_gradient()

    if ser.in_waiting > 0:
        line = ser.readline().decode('utf-8').strip()
        print(line)  # Display message from Arduino

        # Check the content of the line
        if "Vote registered" in line:
            # Extract color from the message
            if "Red" in line:
                sound1.play()  # Play the first sound
                vote("Red")
                total_red_votes += 1
                total_votes += 1
                display_votes("Red")  # Update display after red vote
            elif "Blue" in line:
                sound1.play()  # Play the first sound
                vote("Blue")
                total_blue_votes += 1
                total_votes += 1
                display_votes("Blue")  # Update display after blue vote

        # Update total votes display (after each message)
        display_votes()  # Update display with total votes


import binascii
import os
import string
import random


def generate_key(length = 40):
    characters = string.ascii_letters + string.digits
    random_string = ''.join(random.choice(characters) for _ in range(length))
    return random_string

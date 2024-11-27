from hashlib import sha256


def hash_any(any) -> str:
    return sha256(any.encode()).hexdigest()
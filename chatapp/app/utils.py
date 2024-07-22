

def get_user_data(user):
    data={
        'id': user.id,
        "username": user.username,
        "email": user.email,
        "full_name": f"{user.first_name} {user.last_name}"
    }
    return data
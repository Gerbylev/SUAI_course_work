from collections import UserDict
from tabnanny import check

from suai_project.dao.user_dao import UserDAO

if __name__ == "__main__":
    result = UserDAO.find_all()
    print(result)
    result = UserDAO.find_one_or_none_by_id(2)
    print(result)
    user = {"username": "oleg", "password": "111", "full_name": "oleg"}
    check = UserDAO.add(**user)
    if check:
        print( {"message": "Факультет успешно добавлен!", "major": user} )
    else:
        print({"message": "Ошибка при добавлении факультета!"})
    # check = UserDAO.update(filter_by={'id': 1}, **user)
    # if check:
    #     print({"message": "Описание факультета успешно обновлено!", "major": user})
    # else:
    #     print({"message": "Ошибка при обновлении описания факультета!"})

    # check = UserDAO.delete(id=1)
    # if check:
    #     print({"message": f"Факультет с ID {user} удален!"})
    # else:
    #     print({"message": "Ошибка при удалении факультета!"})
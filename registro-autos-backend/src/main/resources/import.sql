-- Solo para pruebas: crea otro usuario y auto
INSERT INTO users (username, password_hash, email)
VALUES ('ana', '$2a$10$yTgcJmH1R0rrwXh4fWwENE3uv1H.ylfA7qXDz22B5B6DkZHX9CAie', 'ana@example.com');

DECLARE @uid INT = (SELECT id FROM users WHERE username = 'ana');

INSERT INTO cars (user_id, brand, model, year, plate, color)
VALUES
    (@uid, 'Honda', 'Civic', 2021, 'ZZZ111', 'Blanco');


INSERT INTO `users` (`id`, `name`, `lastname`,`email`, `password`, `age`)
VALUES
(1,'admin','rr','admin@mail.ru','$2a$12$ws5QO3VZ5CF.BuWxm5QWYOeWNK25Ipa8pIS2coDfpStR5QZmadPI6', 33),
(2,'user','ww','user@mail.ru','$2a$12$ws5QO3VZ5CF.BuWxm5QWYOeWNK25Ipa8pIS2coDfpStR5QZmadPI6', 52);

INSERT INTO `roles` (`id`, `role`)
VALUES
(1,'ROLE_ADMIN'),
(2,'ROLE_USER');

insert into users_roles
values
(1, 1),
(1, 2),
(2, 2);
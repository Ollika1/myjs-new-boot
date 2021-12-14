
INSERT INTO `users` (`email`, `name`, `lastname`, `password`, `age`)
VALUES
('admin@mail.ru','admin','rr','$2a$12$ws5QO3VZ5CF.BuWxm5QWYOeWNK25Ipa8pIS2coDfpStR5QZmadPI6', 33),
('user@mail.ru', 'user','ww','$2a$12$ws5QO3VZ5CF.BuWxm5QWYOeWNK25Ipa8pIS2coDfpStR5QZmadPI6', 52);

INSERT INTO `roles` (`role`)
VALUES
('ROLE_ADMIN'),
('ROLE_USER');

INSERT INTO `users_roles` (`user_id`, `role_id`) VALUES (1, 1);
INSERT INTO `users_roles` (`user_id`, `role_id`) VALUES (1, 2);
INSERT INTO `users_roles` (`user_id`, `role_id`) VALUES (2, 2);

-- password 1

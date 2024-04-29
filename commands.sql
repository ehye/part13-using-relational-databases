CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text NOT NULL,
    url text NOT NULL,
    title text NOT NULL,
    likes integer NOT NULL
);
insert into blogs (title,author,url,likes) values ('React patterns','Michael Chan','https://reactpatterns.com/',7);
insert into blogs (title,author,url,likes) values ('Type wars','Robert C. Martin','http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',2);

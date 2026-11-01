-- MACHINE MINDS CTF: event challenges
-- RUN ONCE, BEFORE THE EVENT. This deletes every existing challenge and, with
-- them, all submissions and solves. Never run it once teams have started playing.
-- Only SHA-256 hashes of the flags are stored here. Plaintext answers are in
-- ORGANISER_ANSWERS.md, kept outside the repository.

DELETE FROM public.challenges;

INSERT INTO public.challenges
  (title, description, category, difficulty, points, flag_hash, hint, hint_penalty, attachment_url, is_active, sort_order)
VALUES
('Warm-up', $q$Welcome to Machine Minds.

Every flag looks like `flag{something}`. To see how submitting works, type this one into the box below:

```
flag{welcome_to_machine_minds}
```

Correct flags earn points for your team. Wrong ones cost nothing, but there is a short wait between attempts.$q$, 'misc', 'easy', 50, 'c48cf22f91e4d42e5cdec78ca518adae17f124476e20aed8caf50a5737511ce1', NULL, 0, NULL, true, 1),
('The Archive', $q$This page looks empty, but websites carry more than what you see.

[Open the site](/ctf/w1/index.html)

Something is hidden in how the page is built.$q$, 'web', 'easy', 100, '13f0902326f8619b0478050515fd86b03a0ed125227f109b5d1188a914393c9b', 'Right-click the page and choose View page source.', 20, NULL, true, 2),
('Message from Rome', $q$A general sent this note to his commander. Every letter was moved a fixed number of places along the alphabet.

```
iodj{fdhvdu_zdv_khuh}
```

Braces, underscores and punctuation were left alone.$q$, 'crypto', 'easy', 100, '05d9708232e391eac886363ec3c4d04a5ec1411c1e0048e458a623a955d5baf3', 'The shift is small. Try them all with an online Caesar cipher tool.', 20, NULL, true, 3),
('Fine Print', $q$An analyst left this report behind. The pages say nothing useful, but every file carries details about itself.

Download the file and look past the text.$q$, 'forensics', 'easy', 100, '228312d4ec7966320915e5835f84054a10c50ab06afda515cd0e782c45d5cf76', 'Open the document''s properties in a PDF reader.', 20, '/ctf/f1/report.pdf', true, 4),
('The First Flag', $q$Capture the Flag contests started at a famous yearly hacker conference in Las Vegas, at its 4th edition in 1996.

What is the conference called? Write it in lowercase with no spaces and submit it as `flag{name}`.$q$, 'osint', 'easy', 100, 'a3731563247e10e0d25f2e038a2b47b0993b830280b5571bcdca1e404cb11d81', NULL, 0, NULL, true, 5),
('Machines Count', $q$A robot sent you this. It only speaks in ones and zeros.

```
01100110 01101100 01100001 01100111 01111011 01100010 01101001 01101110 01100001 01110010 01111001 01011111 01101001 01110011 01011111 01101010 01110101 01110011 01110100 01011111 01101110 01110101 01101101 01100010 01100101 01110010 01110011 01111101
```

Each group of eight digits is one character.$q$, 'misc', 'easy', 100, '3b63a24d12b9bd3b89c63856fc4645f4222149404bc217ecac6c681d57242c4a', NULL, 0, NULL, true, 6),
('Keep Out', $q$This site asks search engines to stay away from some of its pages. Well-behaved crawlers listen. You are not a crawler.

[Open the site](/ctf/w2/index.html)$q$, 'web', 'easy', 150, '79a3878d34b0d01e1c28a927a5af4f5961cd38733592650a716bed7e07c3ca65', 'Every site can publish a file that lists places crawlers should not visit. Its name has the word robots in it.', 30, NULL, true, 7),
('Onion', $q$This message has been wrapped in three layers. Each layer is a common encoding or simple cipher, and you need to peel them in the right order.

```
63336c7564487435626d78795a575a6665585a34636c39755956396959585a695958303d
```

A tool that chains decoders will save you time.$q$, 'crypto', 'medium', 200, '1ff43d1237708c1e77bc8a30c82b8a71014f52959241071ee8ad3c753293e499', 'Outside to inside: hex, then base64, then ROT13.', 40, NULL, true, 8),
('I''m a Teapot', $q$The HTTP status code 418, "I'm a teapot", comes from an April Fools' document published in 1998.

Which RFC number defines it? Submit it as `flag{rfc_NNNN}`.$q$, 'osint', 'medium', 200, '41a0d3391cec95fb34517341a457e34b304432047afc460a865dd1286575323e', NULL, 0, NULL, true, 9),
('Bleeding Heart', $q$In 2014 a flaw in OpenSSL's heartbeat feature let attackers read secrets from the memory of servers around the world. It got a catchy nickname and an official CVE identifier.

Submit the CVE as `flag{cve_YYYY_NNNN}` using underscores.$q$, 'osint', 'medium', 200, 'e2f176419a0b375b0d9212f55cda8c600f78c5e93a44de769c030c983f5c071d', NULL, 0, NULL, true, 10),
('Members Only', $q$This page wants a passphrase. You do not have one.

[Open the site](/ctf/w3/index.html)

A page can only check what is sent to your browser, and your browser can read all of it.$q$, 'web', 'medium', 200, 'e04a0607fafd5e8952ec68c8121aab620b2986e34c173f6822edde0623539f6f', 'The page loads a script. Read it.', 30, NULL, true, 11),
('Hidden Passenger', $q$This is a perfectly normal picture. It opens fine in any viewer. But files can carry more than they show.

Download it and look at the raw contents.$q$, 'forensics', 'medium', 200, '3d92f285c869302aec46e72bcfbfcacae6765adff158e5b40b90dfae47718815', 'Open the image in a text editor like Notepad and scroll to the very end.', 40, '/ctf/f2/photo.png', true, 12),
('The Right Key', $q$This message was encrypted with a Vigenère cipher. The key is the name of the college festival this event belongs to, written as one lowercase word.

```
ulro{qixxnrge_emzdj_t_gbdd_bmt}
```

Braces and underscores were not encrypted and did not use up a letter of the key.$q$, 'crypto', 'medium', 250, 'b668306f9e2aabb6bce3622bee9b61fb936eee9436e75b604ba5cea9a5ccc56b', 'The festival is Parivartan.', 50, NULL, true, 13),
('Strange Language', $q$A programmer left this program behind. It prints something when it runs, but it is written in a language made to be difficult to read.

```
>++++++++++[->++++++++++<]>++.>++++++++++[->++++++++++<]>++++++++.>+++++++++[->++++++++++<]>+++++++.>++++++++++[->++++++++++<]>+++.>++++++++++++[->++++++++++<]>+++.>++++++++++[->++++++++++<]>+.>+++++++++++[->++++++++++<]>+++++.>+++++++++++[->++++++++++<]>+.>+++++++++++[->++++++++++<]>++++++.>++++++++++[->++++++++++<]>+.>+++++++++++[->++++++++++<]>++++.>++++++++++[->++++++++++<]>+++++.>+++++++++[->++++++++++<]>+++++++++.>+++++++++[->++++++++++<]>+++++.>+++++++++[->++++++++++<]>++++++++.>+++++++++++[->++++++++++<]>+++++++.>+++++++++++[->++++++++++<]>++++++.>+++++++++[->++++++++++<]>+++++.>+++++++++++[->++++++++++<]>++++.>++++++++++[->++++++++++<]>+.>+++++++++[->++++++++++<]>+++++++.>++++++++++[->++++++++++<]>.>+++++++++[->++++++++++<]>+++++++.>+++++++++[->++++++++++<]>++++++++.>++++++++++[->++++++++++<]>++++++++.>++++++++++[->++++++++++<]>+.>++++++++++++[->++++++++++<]>+++++.
```

You do not need to understand it, only to run it.$q$, 'misc', 'medium', 250, '03eb54511d7ecc87e07dc575e54962dff530e191a87751289b8616640f77c43e', 'Search for an online interpreter for the language named after a four-letter word starting with b.', 50, NULL, true, 14),
('Two in One', $q$This looks like a holiday photo, and it is one. It is also something else.

Download it and find what is inside.$q$, 'forensics', 'hard', 350, 'c9c4d8c901c23832518228bd6fb526145ae998051c6ce6f83e9858a4945246b2', 'A file does not have to be only one kind of file. Try opening it with 7-Zip, or change its extension.', 60, '/ctf/f3/holiday.png', true, 15),
('Breadcrumbs', $q$This site has nothing on it, but it loads more than it shows.

[Open the site](/ctf/w4/index.html)

Each clue leads to the next. The last one needs two small steps to read.$q$, 'web', 'hard', 400, '82171e7191bcc13255405617a7fe15009f24aa387ef6b7a5663f400a17578af8', 'Start with the page source. Find what the page loads, then decode what you find there.', 60, NULL, true, 16);

# -*- coding: utf-8 -*-
# Chunks (phrases to read as one unit): "french|english". Longest match wins; matched on the paper pages and in the transcript.
RAW = """
vous allez entendre|you are going to hear
deux fois|twice
cochez la bonne case|tick the correct box
cochez les deux bonnes cases|tick the two correct boxes
chez votre amie|at your friend’s house
quelques secondes|a few seconds
il y a une pause|there is a pause
en écrivant|by writing
plus tard|later
en ville|into town
ce matin|this morning
avant de sortir|before going out
à pied|on foot
il fait beau|the weather is nice
n’oublie pas de|don’t forget to
lunettes de soleil|sunglasses
jus d’orange|orange juice
pommes de terre|potatoes
pomme de terre|potato
avoir besoin de|to need
besoin d’|(a) need of
mettre la table|to set the table
m’aider à|to help me
s’il te plaît|please
films de science-fiction|science-fiction films
film de science-fiction|science-fiction film
dans la cuisine|in the kitchen
au marché|at the market
magasin de vêtements|clothes shop
vous demande de faire|asks you to do
quel genre de|what kind of
regarder la télé|to watch TV
passer un séjour|to spend a stay
faire une promenade|to go for a walk
vues magnifiques|wonderful views
visites guidées|guided tours
vieux quartiers|old districts
au printemps|in spring
village de Noël|Christmas village
spectacles de marionnettes|puppet shows
spectacle de marionnettes|puppet show
tous les après-midi|every afternoon
pas trop chers|not too expensive
fruits de mer|seafood
bon séjour|enjoy your stay
ça va bientôt être|it will soon be
tu te souviens de|do you remember
l’année dernière|last year
toute la nuit|all night
occupé à faire ses devoirs|busy doing his homework
ne sort pas|doesn’t go out
très strict|very strict
ça te dit|how about it?
n’est jamais à l’heure|is never on time
à la fin du|at the end of the
ça fait longtemps que|it’s been a long time since
énormément de|a huge amount of
moins sportif|less sporty
aller à la patinoire|to go to the ice rink
un moment très agréable|a very pleasant time
super sympa|really nice
il a de la chance|he’s lucky
jeux télévisés|TV game shows
jeu télévisé|TV game show
des milliers d’euros|thousands of euros
reparti avec|went home with
pas mal|not bad
épreuves sportives|sports challenges
s’habiller|to get dressed
comme on voulait|as you wanted
à cause de|because of
à cause des|because of the
tout s’est bien passé|everything went well
sauf qu’|except that
je ne savais plus|I no longer knew
ce que je voulais dire|what I wanted to say
présentation orale|oral presentation
épreuve écrite|written test
entretien individuel|one-to-one interview
à l’aise|at ease
trop sérieux|too serious
à part ça|apart from that
quand même|all the same
plus nombreux que|more numerous than
deux fois plus que|twice as many as
dans toute la France|throughout France
ont travaillé dur|worked hard
ramasser des déchets|to pick up rubbish
course à pied|running race
s’est chargé de|took charge of
se marier|to get married
elle aurait pu|she could have
bien sûr|of course
mais non|oh no, not at all
robe de mariée|wedding dress
robe de soirée|evening dress
meilleure copine|best friend (f.)
pollution numérique|digital pollution
me préoccupe|worries me
ont tendance à|tend to
dans des tiroirs|in drawers
encore pire|even worse
machines à laver|washing machines
toute une équipe|a whole team
ne plus en créer|not to create any more of it
le plus possible|as much as possible
à qui appartient|who owns
n’est pas une vie de rêve|is not a dream life
maintenant que|now that
travaux de rénovation|renovation work
deux fois plus cher|twice as expensive
à la fin du mois|at the end of the month
faire le ménage|to do the cleaning
long week-end|long weekend
la semaine prochaine|next week
faire visiter|to show round
jouer le rôle de|to play the role of
ce qui se fait beaucoup|what is very popular
en ce moment|at the moment
offrir un week-end|to give a weekend
cadeau d’anniversaire|birthday present
gagnent bien leur vie|earn a good living
est à la mode|is fashionable
il y a quelques années|a few years ago
va boire|is going to drink
quelque chose|something
après ça|after that
pendant le jeu|during the game
il faut|you must, it is necessary
à son avis|in his opinion
tout illuminé|all lit up
la vie de château|castle life
passe beaucoup de temps à|spends a lot of time
fait régulièrement du patinage|goes skating regularly
va déménager|is going to move house
l’été prochain|next summer
a organisé une fête|organised a party
l’an dernier|last year
est toujours en retard|is always late
une famille très gentille|a very kind family
s’est occupé de|took care of
pour gagner|in order to win
a dû|had to
bien connaître|to know well
la peur de|the fear of
qu’est-ce que|what
ce qu’il allait dire|what he was going to say
se présenter|to introduce oneself
devant la caméra|in front of the camera
se montrer|to show oneself
savent danser|know how to dance
ont rempli|filled
ont balayé|swept
ramassé du plastique en courant|picked up plastic while running
à la poubelle|in the bin
se cassent facilement|break easily
pour protéger la planète|to protect the planet
éviter de créer|to avoid creating
bacs de tri|sorting bins
club écologique|eco club
ont nettoyé|cleaned
quelques jours|a few days
des fiançailles|an engagement
pour célébrer|to celebrate
qui sourit facilement|who smiles easily
parler naturellement|to speak naturally
tu aimes ça|do you like that?
quelle idée géniale|what a brilliant idea
elle ne voulait pas|she didn’t want to
dans notre famille|in our family
une vie de rêve|a dream life
je comprends|I understand
loue un car|hires a coach
louer un car|to hire a coach
servir les repas du soir|to serve the evening meals
agence de voyage|travel agency
si l’endroit lui plaît|if she likes the place
voyageurs allemands|German travellers
l’endroit idéal|the ideal place
des amis à elle|friends of hers
le parc est parfait pour les photos|the park is perfect for photos
"""
RAW += """
une série de remarques|a series of remarks
courts dialogues|short dialogues
chaque remarque ou dialogue|each remark or dialogue
pour chaque question|for each question
le premier jour|the first day
vous êtes dans la cuisine|you are in the kitchen
comment allez-vous|how are you going
vous parle|speaks to you
qu’est-ce que vous devez prendre|what must you take
où allez-vous|where are you going
veut boire|wants to drink
dans un café|in a café
vous allez au marché|you go to the market
de quel légume|which vegetable
vous entrez dans|you go into
veut acheter|wants to buy
vous rentrez chez|you go back to
pour dîner|for dinner
le père de|the father of
après le dîner|after dinner
veut regarder|wants to watch
vous allez entendre des renseignements sur|you will hear information about
attractions touristiques|tourist attractions
vous avez d’abord|first you have
pour lire les questions|to read the questions
vous pouvez aussi visiter|you can also visit
les soirées avec|the evenings with
finissent à|finish at
on peut acheter|you can buy
plat recommandé|recommended dish
au restaurant|at the restaurant
conversation entre|conversation between
sa sœur|his sister
choisissez l’affirmation|choose the statement
qui correspond à|that matches
dans l’espace approprié|in the appropriate space
la bonne lettre|the right letter
à étudier|studying
deux interviews|two interviews
d’abord avec|first with
puis avec|then with
ils parlent de|they talk about
première partie|first part
deuxième partie|second part
au jeu télévisé|on the TV game show
beaucoup d’argent|a lot of money
un vélo électrique|an electric bike
une belle voiture|a nice car
être bon en sport|to be good at sport
jouer de la trompette|to play the trumpet
bien connaître un thème|to know a theme well
avant l’émission|before the programme
un professionnel s’est occupé de|a professional took care of
de la coiffure|of the hairstyle
du maquillage|of the make-up
des vêtements|of the clothes
selon Aubin|according to Aubin
le plus difficile|the most difficult
pour un participant|for a participant
la température élevée|the high temperature
les conditions stressantes|the stressful conditions
faire des erreurs|to make mistakes
que s’est-il passé|what happened
un participant est sorti du studio|a participant left the studio
la lumière s’est éteinte|the light went out
une seconde|a second
a oublié|forgot
pour l’émission d’aujourd’hui|for today’s programme
les candidats|the candidates
raconter une histoire|to tell a story
passer un test écrit|to take a written test
se présenter oralement|to introduce yourself orally
pour l’entretien individuel|for the one-to-one interview
être naturel|to be natural
se montrer courageux|to show courage
regarder les spectateurs|to look at the spectators
apprécie surtout|especially likes
pour certaines émissions|for certain programmes
cherche des candidats qui|is looking for candidates who
sont drôles|are funny
aiment chanter|like to sing
journée du nettoyage|clean-up day
journée du nettoyage de la nature|Nature Clean-up Day
jeune français|young Frenchman
a participé à|took part in
cette année|this year
la dernière fois|last time
des retraités|retired people
beaucoup de sacs|lots of bags
leur école|their school
il y avait|there were
recyclé des objets en bois|recycled wooden objects
collecté des bouteilles en verre|collected glass bottles
campagne publicitaire|advertising campaign
a été louée|was rented
dans un magasin|in a shop
était faite de|was made of
tissu recyclé|recycled fabric
d’une grande valeur|of great value
a été offerte par|was given by
est inquiet|is worried
équipements électroniques|electronic equipment
jettent leurs vieux portables|throw away their old phones
est invisible|is invisible
les déchets les plus dangereux|the most dangerous waste
appareils ménagers|household appliances
il faut surtout|above all you must
utiliser des bacs de tri|to use sorting bins
éviter de créer des déchets|to avoid creating waste
réduire la pollution de l’air|to reduce air pollution
être membre d’un|to be a member of a
parle de sa vie|talks about her life
dans un château|in a castle
il y a deux pauses|there are two pauses
a acheté le château|bought the castle
trouve la vie de château formidable|finds castle life wonderful
comprend mieux|understands better
les problèmes de ses parents|her parents’ problems
les réparations du château|the castle repairs
coûtent aussi cher que|cost as much as
une partie du château|part of the castle
va devenir un hôtel|is going to become a hotel
faire venir un électricien|to call in an electrician
les clients américains|the American customers
veulent rester|want to stay
une semaine|a week
un guide touristique|a tour guide
va être employé|is going to be employed
a l’intention de|intends to
servir le dîner|to serve dinner
aux clients|to the customers
propose déjà des séjours|already offers stays
offrir un séjour|to give a stay
a célébré ses|celebrated her
dans le château d’Adélie|in Adélie’s castle
voudrait utiliser|would like to use
célébrer des fiançailles|to celebrate an engagement
aimerait inviter|would like to invite
vous avez maintenant six minutes|you now have six minutes
recopier vos réponses|copy your answers
feuille de réponses|answer sheet
suivez les instructions|follow the instructions
on va aller|we are going to go
on va prendre|we are going to take
on va visiter|we are going to visit
je vais prendre|I am going to have
je dois acheter|I must buy
est-ce que tu peux|can you
je préfère|I prefer
venez passer|come and spend
faites une belle promenade|take a nice walk
pour profiter de|to make the most of
sont organisées|are organised
vous faire découvrir|to let you discover
ont lieu|take place
en juillet et en août|in July and August
elles commencent à|they start at
nous vous proposons de|we suggest that you
faire un tour|to take a trip
sur le quai|on the quay
il y a beaucoup d’animations|there are lots of activities
vous pourrez aussi acheter|you will also be able to buy
pour votre famille et vos amis|for your family and friends
on y trouve de tout|you find everything there
par exemple|for example
bons petits restaurants|nice little restaurants
nous vous recommandons de|we recommend that you
goûter à|to taste
qui viennent directement de|which come straight from
chez elle|at her place
elle nous avait invités à|she had invited us to
un samedi soir|on a Saturday evening
on a dansé toute la nuit|we danced all night
c’était formidable|it was great
comment va-t-il|how is he
est toujours très occupé à|is always very busy
faire ses devoirs|to do his homework
dans la semaine|during the week
pas vraiment|not really
on pourrait peut-être aller manger|we could perhaps go and eat
un de ces jours|one of these days
bonne idée|good idea
rappelle-toi que|remember that
la dernière fois que|the last time that
aller au cinéma|to go to the cinema
à la fin du film|at the end of the film
j’avais oublié|I had forgotten
au fait|by the way
fait énormément de sport|does a huge amount of sport
j’aime bien|I quite like
le samedi|on Saturdays
on y passe toujours|we always spend there
je crois que|I think that
ton copain|your friend
tu le vois souvent|do you see him often
très peu|very few
j’ai rencontré|I met
ses parents|his parents
son petit frère|his little brother
vous avez participé à|you took part in
prix importants|big prizes
ah bravo|well done
qu’est-ce que vous avez dû faire|what did you have to do
dans mon cas|in my case
répondre à des questions difficiles|to answer difficult questions
sujet de mon choix|a subject of my choice
il n’y avait pas de|there were no
on vous avait bien préparé|you had been well prepared
un professionnel m’a coiffé|a professional did my hair
j’ai mis des vêtements légers|I wore light clothes
ah bon|oh really
on croit toujours que|people always think that
le plus dur|the hardest part
en réalité|in reality
le plus pénible|the most unpleasant
la chaleur tropicale|the tropical heat
sur le plateau de télévision|on the TV set
et sinon|and apart from that
plutôt bien|rather well
à un moment|at one point
ça peut être désastreux|it can be disastrous
si le silence dure|if the silence lasts
plus de quelques secondes|more than a few seconds
comment choisissez-vous|how do you choose
ça dépend|it depends
devant les autres candidats|in front of the other candidates
et ensuite|and then
il y a toujours|there is always
il faut pouvoir|you have to be able to
en oubliant la caméra|forgetting the camera
il n’y a pas de spectateurs|there are no spectators
cette partie de la sélection|this part of the selection
quel genre de candidats|what kind of candidates
cherchez-vous en général|do you look for in general
surtout quelqu’un qui|above all someone who
plus important que|more important than
très intelligent mais trop sérieux|very intelligent but too serious
capables d’amuser le public|able to entertain the audience
comment s’est passée|how did it go
plusieurs centaines de|several hundred
certains écoliers et étudiants|some pupils and students
en petits groupes|in small groups
quel était ton rôle|what was your role
un des organisateurs|one of the organisers
chaque mois|every month
une activité différente|a different activity
un événement sportif|a sporting event
plusieurs kilos de|several kilos of
en 30 minutes|in 30 minutes
un de mes collègues|one of my colleagues
collecte de bouteilles en verre|collection of glass bottles
s’intéressent à l’environnement|are interested in the environment
presque tous|almost all
avait besoin d’une robe|needed a dress
le mois dernier|last month
dépenser beaucoup d’argent|to spend a lot of money
elle aurait pu en louer une|she could have rented one
comme le font beaucoup de femmes|as many women do
a été réalisée en recyclant|was made by recycling
quel genre de pollution|what kind of pollution
t’inquiète le plus|worries you most
elle n’a pas d’odeur|it has no smell
en moyenne|on average
huit appareils numériques|eight digital devices
garder leurs anciens portables|to keep their old phones
chez eux|at home
sont très difficiles à recycler|are very hard to recycle
une catastrophe|a disaster
on trouve régulièrement|you regularly find
sous des ponts|under bridges
il faut en général|you generally need
pour les enlever de là|to remove them from there
au final|in the end
la chose essentielle|the essential thing
il faut bien sûr participer à|of course you must take part in
on en a vraiment besoin|we really need it
bien entendu|of course
il est aussi nécessaire de|it is also necessary to
continuer à trier|to keep sorting
le plus important|the most important thing
en fait|in fact
toujours été dans notre famille|always been in our family
très ancien et immense|very old and huge
j’y ai passé une enfance agréable|I spent a pleasant childhood there
mes parents sont toujours stressés|my parents are always stressed
il y a toujours quelque chose à réparer|there is always something to repair
un bon salaire|a good salary
tous les deux|both of them
malgré ça|despite that
il ne leur reste jamais assez d’argent|they never have enough money left
ont décidé de|decided to
devenir hôteliers|to become hoteliers
changer l’utilisation de|to change the use of
la moitié du château|half of the castle
un hôtel de luxe|a luxury hotel
ils vont devoir|they will have to
dans les chambres|in the bedrooms
porter les bagages|to carry the luggage
un groupe de 25 Américains|a group of 25 Americans
arrive pour|arrives for
comme il faudra les occuper|as they will need to be kept busy
pour leur faire visiter la région|to show them round the region
guide touristique|tour guide
si je peux|if I can
j’aimerais bien|I would really like to
pendant leur séjour|during their stay
la représentante d’une agence de voyage|the representative of a travel agency
doit venir bientôt|is due to come soon
elle proposera des séjours|she will offer stays
comme cadeau d’anniversaire|as a birthday present
quelques jours magiques|a few magical days
pour son 20ème anniversaire|for her 20th birthday
vous voulez faire pareil|do you want to do the same
un événement spécial|a special event
on a de la place pour|we have room to
recevoir les invités|to receive the guests
"""
PHR = []
_seen = set()
for ln in RAW.strip().split('\n'):
    if not ln.strip(): continue
    fr, en = ln.split('|'); fr = fr.strip()
    if fr.lower() in _seen: continue
    _seen.add(fr.lower()); PHR.append([fr, en.strip()])

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
PHR = []
for ln in RAW.strip().split('\n'):
    fr, en = ln.split('|'); PHR.append([fr.strip(), en.strip()])

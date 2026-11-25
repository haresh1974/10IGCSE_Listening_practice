# -*- coding: utf-8 -*-
# Questions for 0520/11 O/N 2025 (Listening). Option = (French cue / text, English).
# X = distractor notes for WRONG options only: (kind, note, quote)
#   kind: 'none' never mentioned | 'heard' something similar is heard but it does not answer the question | 'opp' the speaker says the opposite
N = ('none', 'Never mentioned in the recording.', '')

def Qd(n, ch, stem, stem_en, opts, ans, x, ev, kind='tick', pic=False):
    return dict(n=n, ch=ch, stem=stem, stem_en=stem_en, opts=opts, ans=ans, x=x, ev=ev, kind=kind, pic=pic)

Q = []
# ---------- Part 1: Q1-8 pictures ----------
Q.append(Qd(1, 'c1', 'Comment allez-vous en ville ce matin ?', 'How are you getting into town this morning?',
  {'A': ('à pied', 'on foot / walking'), 'B': ('la voiture', 'car'), 'C': ('le bus', 'bus'), 'D': ('le métro / le tramway', 'metro / tram')},
  ['C'], {'A': N, 'B': N, 'D': ('none', 'A train or tram is never mentioned: Florence says “le bus”.', '')},
  ['On va prendre le bus'], pic=True))
Q.append(Qd(2, 'c2', 'Qu’est-ce que vous devez prendre ?', 'What do you have to take?',
  {'A': ('les lunettes de soleil', 'sunglasses'), 'B': ('la casquette', 'cap'), 'C': ('le sac à dos', 'backpack'), 'D': ('le parapluie', 'umbrella')},
  ['A'], {'B': N, 'C': N, 'D': ('opp', 'The weather is fine (“il fait beau”), so you would not need an umbrella.', 'Il fait beau aujourd’hui')},
  ['lunettes de soleil'], pic=True))
Q.append(Qd(3, 'c3', 'Où allez-vous aujourd’hui ?', 'Where are you going today?',
  {'A': ('le musée', 'museum'), 'B': ('l’église', 'church'), 'C': ('le lac / les montagnes', 'lake / mountains'), 'D': ('le stade', 'stadium')},
  ['D'], {'A': N, 'B': N, 'C': N}, ['le stade Olympique'], pic=True))
Q.append(Qd(4, 'c4', 'Qu’est-ce que Florence va boire ?', 'What is Florence going to drink?',
  {'A': ('le jus d’orange', 'orange juice'), 'B': ('le jus de pomme', 'apple juice'), 'C': ('le jus de raisin', 'grape juice'), 'D': ('le jus d’ananas', 'pineapple juice')},
  ['A'], {'B': N, 'C': N, 'D': N}, ['un jus d’orange'], pic=True))
Q.append(Qd(5, 'c5', 'De quel légume parle Florence ?', 'Which vegetable is Florence talking about?',
  {'A': ('le chou-fleur', 'cauliflower'), 'B': ('la pomme de terre', 'potato'), 'C': ('le poivron', 'pepper'), 'D': ('le concombre', 'cucumber')},
  ['B'], {'A': ('none', 'Not mentioned. “Des légumes” is general; only one vegetable is named.', 'des légumes'), 'C': N, 'D': N},
  ['pommes de terre'], pic=True))
Q.append(Qd(6, 'c6', 'Qu’est-ce que Florence veut acheter ?', 'What does Florence want to buy?',
  {'A': ('le pantalon', 'trousers'), 'B': ('le maillot de bain', 'swimsuit'), 'C': ('la veste', 'jacket'), 'D': ('le short', 'shorts')},
  ['C'], {'A': N, 'B': ('heard', 'Tempting because of “l’été”, but she asks for a jacket, not swimwear.', 'une veste pour l’été'), 'D': ('heard', 'Tempting because of “l’été”, but she asks for a jacket, not shorts.', 'une veste pour l’été')},
  ['une veste'], pic=True))
Q.append(Qd(7, 'c7', 'Qu’est-ce que le père de Florence vous demande de faire ?', 'What does Florence’s father ask you to do?',
  {'A': ('faire la vaisselle', 'wash up'), 'B': ('mettre la table', 'set the table'), 'C': ('passer l’aspirateur', 'vacuum'), 'D': ('laver le sol', 'mop the floor')},
  ['B'], {'A': N, 'C': N, 'D': N}, ['mettre la table'], pic=True))
Q.append(Qd(8, 'c8', 'Quel genre de film préfère Florence ?', 'What type of film does Florence prefer?',
  {'A': ('le film d’horreur', 'horror film'), 'B': ('le dessin animé', 'cartoon'), 'C': ('le film de science-fiction', 'science-fiction film'), 'D': ('le film romantique', 'romantic film')},
  ['C'], {'A': N, 'B': N, 'D': N}, ['les films de science-fiction'], pic=True))
# ---------- Part 2: Q9-14 Monaco ----------
Q.append(Qd(9, 'c9', 'À Monaco, il y a des vues magnifiques sur :', 'In Monaco there are magnificent views of:',
  {'A': ('la place / la statue', 'the square / statue'), 'B': ('le port', 'the harbour'), 'C': ('la cathédrale', 'the cathedral'), 'D': ('les montagnes', 'the mountains')},
  ['B'], {'A': N, 'C': N, 'D': N}, ['vues magnifiques sur le port'], pic=True))
Q.append(Qd(10, 'c9', 'À Monaco-ville, vous pouvez aussi visiter :', 'In Monaco-ville you can also visit:',
  {'A': ('le centre commercial', 'shopping centre'), 'B': ('le parc / l’entrée du jardin', 'park / garden gate'), 'C': ('le palais', 'palace'), 'D': ('les vieux quartiers', 'the old districts')},
  ['D'], {'A': N, 'B': N, 'C': N}, ['les vieux quartiers de la ville'], pic=True))
Q.append(Qd(11, 'c9', 'Les soirées avec musiciens et danseurs finissent à :', 'The evenings with musicians and dancers finish at:',
  {'A': ('20 heures', '8 p.m.'), 'B': ('21 heures', '9 p.m.'), 'C': ('22 heures', '10 p.m.'), 'D': ('23 heures', '11 p.m.')},
  ['B'], {'A': N, 'C': N, 'D': ('heard', 'You hear “16 heures” first, but that is when they START; they finish at 21 heures.', 'commencent à 16 heures')},
  ['finissent à 21 heures'], pic=True))
Q.append(Qd(12, 'c9', 'Animations au village de Noël :', 'Entertainment at the Christmas village:',
  {'A': ('le spectacle de marionnettes', 'puppet show'), 'B': ('le concert', 'concert'), 'C': ('le cirque', 'circus'), 'D': ('le feu d’artifice', 'fireworks')},
  ['A'], {'B': ('heard', 'Musicians and dancers are mentioned, but for the summer evenings in Monaco-ville, not the Christmas village.', 'avec musiciens et danseurs'), 'C': N, 'D': N},
  ['spectacles de marionnettes'], pic=True))
Q.append(Qd(13, 'c9', 'Au village de Noël, on peut acheter :', 'At the Christmas village you can buy:',
  {'A': ('le cadeau / le gâteau emballé', 'wrapped gift / cake'), 'B': ('le bol', 'bowl'), 'C': ('les bijoux', 'jewellery'), 'D': ('le sac à main', 'handbag')},
  ['C'], {'A': ('heard', '“Des cadeaux” is said, but the question asks which item is given as an example: “bijoux”.', 'des cadeaux pour votre famille'), 'B': N, 'D': N},
  ['de jolis bijoux'], pic=True))
Q.append(Qd(14, 'c9', 'Au restaurant, plat recommandé :', 'At the restaurant, recommended dish:',
  {'A': ('le poulet', 'chicken'), 'B': ('les saucisses', 'sausages'), 'C': ('la viande / le steak', 'meat / steak'), 'D': ('les fruits de mer', 'seafood')},
  ['D'], {'A': N, 'B': N, 'C': N}, ['nos délicieux fruits de mer'], pic=True))
# ---------- Part 3: Q15-19 matching ----------
M = {'A': ('passe beaucoup de temps à étudier', 'spends a lot of time studying'),
     'B': ('fait régulièrement du patinage', 'goes skating regularly'),
     'C': ('va déménager l’été prochain', 'is going to move house next summer'),
     'D': ('a organisé une fête l’an dernier', 'organised a party last year'),
     'E': ('est toujours en retard', 'is always late'),
     'F': ('a une famille très gentille', 'has a very nice family')}
WHO = {'A': 'Antoine', 'B': 'Sylvain', 'D': 'Céline', 'E': 'Lucie', 'F': 'Louis'}
def mx(me, ans):
    d = {}
    for L in 'ABCDEF':
        if L == ans: continue
        if L == 'C': d[L] = ('none', 'Not said about any of the friends.', '')
        else: d[L] = ('heard', 'This belongs to another friend (' + WHO[L] + '), not to ' + me + '.', '')
    return d
for n, nm, a, evd in [(15, 'Céline', 'D', 'elle nous avait invités à célébrer son anniversaire'), (16, 'Antoine', 'A', 'très occupé à faire ses devoirs'),
                      (17, 'Lucie', 'E', 'jamais à l’heure'), (18, 'Sylvain', 'B', 'aller à la patinoire avec lui'), (19, 'Louis', 'F', 'ils sont super sympa')]:
    Q.append(Qd(n, 'c15', nm + '...', nm + '...', dict(M), [a], mx(nm, a), [evd], kind='letter'))
# ---------- Part 4: Q20-28 interviews ----------
def T(n, ch, stem, en, opts, ans, x, ev):
    Q.append(Qd(n, ch, stem, en, opts, ans, x, ev))
T(20, 'c20', 'Qu’est-ce qu’Aubin a gagné au jeu télévisé ?', 'What did Aubin win on the TV game?',
  {'A': ('beaucoup d’argent', 'a lot of money'), 'B': ('un vélo électrique', 'an electric bike'), 'C': ('une belle voiture', 'a nice car')}, ['B'],
  {'A': ('heard', 'You can win “des milliers d’euros” on this show, but Aubin went home with a bike.', 'des milliers d’euros'), 'C': N}, ['un vélo électrique'])
T(21, 'c20', 'Pour gagner, Aubin a dû...', 'To win, Aubin had to...',
  {'A': ('être bon en sport', 'be good at sport'), 'B': ('jouer de la trompette', 'play the trumpet'), 'C': ('bien connaître un thème', 'know a subject well')}, ['C'],
  {'A': ('opp', 'He says there were no sports challenges.', 'pas d’épreuves sportives'), 'B': N}, ['questions difficiles sur un sujet de mon choix'])
T(22, 'c20', 'Avant l’émission, un professionnel s’est occupé ..... d’Aubin.', 'Before the programme, a professional took care of ..... Aubin’s ...',
  {'A': ('de la coiffure', 'hair'), 'B': ('du maquillage', 'make-up'), 'C': ('des vêtements', 'clothes')}, ['A'],
  {'B': N, 'C': ('opp', 'Clothes were his own choice: “on pouvait s’habiller comme on voulait”.', 'on pouvait s’habiller comme on voulait')}, ['un professionnel m’a coiffé'])
T(23, 'c20', 'Selon Aubin, qu’est-ce qui est le plus difficile pour un participant ?', 'According to Aubin, what is hardest for a contestant?',
  {'A': ('la température élevée', 'the high temperature'), 'B': ('les conditions stressantes', 'the stressful conditions'), 'C': ('la peur de faire des erreurs', 'the fear of making mistakes')}, ['A'],
  {'B': ('heard', 'People think stress is the hardest part, but Aubin says “en réalité” it is the heat.', 'le stress d’être à la télé'), 'C': N},
  ['la chaleur tropicale'])
T(24, 'c20', 'Que s’est-il passé pendant le jeu ?', 'What happened during the game?',
  {'A': ('un participant est sorti du studio', 'a contestant left the studio'), 'B': ('la lumière s’est éteinte une seconde', 'the light went out for a second'), 'C': ('Aubin a oublié ce qu’il allait dire', 'Aubin forgot what he was going to say')}, ['C'],
  {'A': N, 'B': ('heard', 'Lights (“projecteurs”) are mentioned, but only because they make the studio hot.', 'à cause des projecteurs')},
  ['je ne savais plus ce que je voulais dire'])
T(25, 'c25', 'Pour l’émission d’aujourd’hui, que devaient faire les candidats ?', 'For today’s show, what did the contestants have to do?',
  {'A': ('raconter une histoire', 'tell a story'), 'B': ('passer un test écrit', 'take a written test'), 'C': ('se présenter oralement', 'introduce themselves orally')}, ['C'],
  {'A': N, 'B': ('heard', 'A written test is mentioned, but only for “d’autres jeux”, not for today’s show.', 'Pour d’autres jeux, ils doivent aussi passer une épreuve écrite')},
  ['une présentation orale'])
T(26, 'c25', 'Pour l’entretien individuel, il faut...', 'For the individual interview, you need to...',
  {'A': ('être naturel devant la caméra', 'be natural in front of the camera'), 'B': ('se montrer courageux', 'show courage'), 'C': ('regarder les spectateurs', 'look at the audience')}, ['A'],
  {'B': N, 'C': ('opp', 'There are no spectators for this part of the selection.', 'Il n’y a pas de spectateurs')}, ['parler naturellement en oubliant la caméra'])
T(27, 'c25', 'Donia apprécie surtout les candidats qui sont...', 'Donia especially likes contestants who are...',
  {'A': ('intelligents', 'intelligent'), 'B': ('souriants', 'smiling / cheerful'), 'C': ('passionnés', 'passionate')}, ['B'],
  {'A': ('opp', 'Being at ease and smiling matters more than being “très intelligent mais trop sérieux”.', 'plus important que quelqu’un de très intelligent'), 'C': N},
  ['qui sourit facilement'])
T(28, 'c25', 'Pour certaines émissions, Donia cherche des candidats qui...', 'For some programmes Donia looks for contestants who...',
  {'A': ('sont drôles', 'are funny'), 'B': ('savent danser', 'can dance'), 'C': ('aiment chanter', 'like singing')}, ['A'],
  {'B': ('opp', '“On ne leur demande pas de danser quand même !” — dancing is not asked.', 'On ne leur demande pas de danser'), 'C': N},
  ['capables d’amuser le public'])
# ---------- Part 5: Q29-34 Félix ----------
T(29, 'c29', 'Cette année, à la Journée du Nettoyage de Toulouse...', 'This year, at the Toulouse Clean-up Day...',
  {'A': ('les jeunes étaient plus nombreux que la dernière fois', 'there were more young people than last time'), 'B': ('des retraités ont rempli beaucoup de sacs', 'retired people filled lots of bags'),
   'C': ('des enfants ont balayé leur école', 'children swept their school'), 'D': ('il y avait 130 000 personnes', 'there were 130,000 people')}, ['A'],
  {'B': N, 'C': ('heard', 'Pupils cleaned their NEIGHBOURHOOD (“leur quartier”), not their school.', 'ont nettoyé leur quartier'), 'D': ('heard', '130,000 is the number across all of France, not in Toulouse.', 'dans toute la France, 130 000 participants')},
  ['C’était deux fois plus que l’an dernier'])
T(30, 'c29', 'Récemment, Félix a...', 'Recently, Félix...',
  {'A': ('recyclé des objets en bois', 'recycled wooden objects'), 'B': ('collecté des bouteilles en verre', 'collected glass bottles'),
   'C': ('organisé une campagne publicitaire', 'organised an advertising campaign'), 'D': ('ramassé du plastique en courant', 'picked up plastic while running')}, ['D'],
  {'A': N, 'B': ('heard', 'It was a colleague of his who collected glass bottles, not Félix.', 'Un de mes collègues s’est chargé d’une collecte de bouteilles en verre'), 'C': N},
  ['ramassé avec des amis plusieurs kilos de plastique'])
T(31, 'c29', 'La robe de mariée d’Athéna...', 'Athéna’s wedding dress...',
  {'A': ('a été louée dans un magasin', 'was rented from a shop'), 'B': ('était faite de tissu recyclé', 'was made of recycled fabric'),
   'C': ('était d’une grande valeur', 'was very valuable'), 'D': ('a été offerte par sa mère', 'was given by her mother')}, ['B'],
  {'A': ('opp', 'Renting is what many women do, “mais non, pas elle”.', 'Elle aurait pu en louer une'), 'C': ('opp', 'She did not want to spend a lot of money on it.', 'Elle ne voulait pas dépenser beaucoup d’argent'),
   'D': ('heard', 'It was made from her best FRIEND’s evening dress, not her mother’s.', 'la robe de soirée de sa meilleure copine')},
  ['réalisée en recyclant la robe de soirée'])
T(32, 'c29', 'Félix est inquiet parce que, à son avis,...', 'Félix is worried because, in his opinion,...',
  {'A': ('il a trop d’équipements électroniques', 'he has too much electronic equipment'), 'B': ('les gens jettent leurs vieux portables à la poubelle', 'people throw old phones in the bin'),
   'C': ('la pollution numérique est invisible', 'digital pollution is invisible'), 'D': ('les tablettes se cassent facilement', 'tablets break easily')}, ['C'],
  {'A': ('opp', 'He says he has very few devices.', 'j’en ai très peu'), 'B': ('opp', 'People keep their old phones in drawers.', 'garder leurs anciens portables dans des tiroirs'), 'D': N},
  ['on ne la voit pas'])
T(33, 'c29', 'Selon Félix, les déchets les plus dangereux sont les...', 'According to Félix, the most dangerous waste is...',
  {'A': ('piles', 'batteries'), 'B': ('métaux', 'metals'), 'C': ('microplastiques', 'microplastics'), 'D': ('appareils ménagers', 'household appliances')}, ['D'],
  {'A': ('heard', 'Batteries and microplastics are named, but he says appliances are “encore pire”.', 'les piles sont très difficiles à recycler'), 'B': N,
   'C': ('heard', 'Batteries and microplastics are named, but he says appliances are “encore pire”.', 'Les microplastiques aussi sont une catastrophe')},
  ['l’électro-ménager, c’est encore pire'])
T(34, 'c29', 'Pour protéger la planète, Félix pense qu’il faut surtout...', 'To protect the planet, Félix thinks we above all need to...',
  {'A': ('utiliser des bacs de tri', 'use sorting bins'), 'B': ('éviter de créer des déchets', 'avoid creating waste'),
   'C': ('réduire la pollution de l’air', 'reduce air pollution'), 'D': ('être membre d’un club écologique', 'be a member of an eco club')}, ['B'],
  {'A': ('heard', 'Sorting is mentioned (“continuer à trier”) but “le plus important” is not producing waste.', 'continuer à trier le plus possible'), 'C': N,
   'D': ('heard', 'Taking part in eco projects is mentioned, but it is not “le plus important”.', 'participer à ces projets écologiques')},
  ['de ne plus en créer'])
# ---------- Part 6: Q35-37 Adélie (choose TWO) ----------
def T2(n, opts, ans, x, ev):
    Q.append(Qd(n, 'c35', '', '', opts, ans, x, ev, kind='two'))
T2(35, {'A': ('La famille d’Adélie a acheté le château il y a quelques années.', 'Adélie’s family bought the castle a few years ago.'),
        'B': ('Adélie trouve la vie de château formidable.', 'Adélie finds castle life wonderful.'),
        'C': ('Adélie comprend mieux maintenant les problèmes de ses parents.', 'Adélie now understands her parents’ problems better.'),
        'D': ('Les réparations du château coûtent aussi cher qu’acheter une maison.', 'Castle repairs cost as much as buying a house.'),
        'E': ('Les parents d’Adélie gagnent bien leur vie.', 'Adélie’s parents earn a good living.')}, ['C', 'E'],
   {'A': ('opp', 'The castle has always been in the family.', 'il a toujours été dans notre famille'), 'B': ('opp', 'She says castle life is not a dream life.', 'la vie de château n’est pas une vie de rêve'),
    'D': ('opp', 'Repairs cost TWICE as much as for a house, not “as much as”.', 'coûtent deux fois plus cher que pour une maison')},
   ['Maintenant que je suis adulte, je comprends', 'gagnent tous les deux un bon salaire'])
T2(36, {'A': ('Une partie du château va devenir un hôtel.', 'Part of the castle is going to become a hotel.'),
        'B': ('Les parents d’Adélie vont faire venir un électricien.', 'Adélie’s parents are going to bring in an electrician.'),
        'C': ('Les clients américains veulent rester une semaine.', 'The American guests want to stay a week.'),
        'D': ('Un guide touristique va être employé.', 'A tour guide is going to be employed.'),
        'E': ('Adélie a l’intention de servir le dîner aux clients.', 'Adélie intends to serve dinner to the guests.')}, ['A', 'E'],
   {'B': ('opp', 'The parents will BE electricians themselves.', 'être électriciens, plombiers'), 'C': ('opp', 'It is a long weekend (“un long week-end”), not a week.', 'pour un long week-end'),
    'D': ('opp', 'Her mother will act as the guide herself; no one is employed.', 'elle va aussi jouer le rôle de guide touristique')},
   ['changer l’utilisation de la moitié du château pour en faire un hôtel', 'j’aimerais bien servir les repas du soir'])
T2(37, {'A': ('Une agence de voyage propose déjà des séjours au château.', 'A travel agency already offers stays at the castle.'),
        'B': ('Adélie dit qu’offrir un séjour dans un château est à la mode.', 'Adélie says giving a stay in a castle is fashionable.'),
        'C': ('Marina a célébré ses 20 ans dans le château d’Adélie.', 'Marina celebrated her 20th birthday in Adélie’s castle.'),
        'D': ('Adélie voudrait utiliser le château pour célébrer des fiançailles.', 'Adélie would like to use the castle to celebrate an engagement.'),
        'E': ('Adélie aimerait inviter des amis à elle au château.', 'Adélie would like to invite her own friends to the castle.')}, ['B', 'D'],
   {'A': ('opp', 'The agency representative has not come yet; she is “doit venir bientôt”.', 'doit venir bientôt'),
    'C': ('opp', 'Marina’s stay was in a castle in Switzerland, not Adélie’s.', 'dans un château en Suisse'), 'E': N},
   ['Ce qui se fait beaucoup en ce moment', 'des fiançailles par exemple'])

CHAPTERS = [
 ('c1', 'Q1', 17.2), ('c2', 'Q2', 89.9), ('c3', 'Q3', 130.1), ('c4', 'Q4', 169.8), ('c5', 'Q5', 206.7), ('c6', 'Q6', 249.9), ('c7', 'Q7', 291.3), ('c8', 'Q8', 332.3),
 ('c9', 'Q9–14 Monaco', 375.4), ('c15', 'Q15–19 Amis', 689.0), ('c20', 'Q20–24 Aubin', 1018.3), ('c25', 'Q25–28 Donia', 1323.5),
 ('c29', 'Q29–34 Félix', 1545.5), ('c35', 'Q35–37 Adélie', 2101.0)]
ANS_MS = {1:'C',2:'A',3:'D',4:'A',5:'B',6:'C',7:'B',8:'C',9:'B',10:'D',11:'B',12:'A',13:'C',14:'D',15:'D',16:'A',17:'E',18:'B',19:'F',20:'B',21:'C',22:'A',23:'A',24:'C',25:'C',26:'A',27:'B',28:'A',29:'A',30:'D',31:'B',32:'C',33:'D',34:'B',35:'C/E',36:'A/E',37:'B/D'}

# ---------- POSSIBLE DISTRACTORS (shown on request; must never point to the answer) ----------
# (L or None, note, quote). L = an option that is wrong but sounds possible; None = a heard word/number that is a trap.
# Rule: at least 2 options (answers+1 for "choose two") must stay un-flagged, so the answer cannot be worked out by elimination.
DX = {
 2: [('D', 'You will hear about the weather (“il fait beau”). Ask yourself what that means for this question.', 'Il fait beau aujourd’hui')],
 5: [(None, 'She says “des légumes” (vegetables) in general first. Listen for the one vegetable she actually names.', 'des légumes')],
 6: [('B', 'You will hear “l’été” (summer). It does not tell you what she wants to buy.', 'pour l’été'), ('D', 'You will hear “l’été” (summer). It does not tell you what she wants to buy.', 'pour l’été')],
 11: [(None, 'You will hear TWO times: “16 heures” and a later one. The question asks when the evenings FINISH.', 'commencent à 16 heures')],
 12: [('B', 'You will hear “musiciens et danseurs”. Check WHEN and WHERE they are mentioned.', 'avec musiciens et danseurs')],
 13: [('A', 'You will hear the general word “cadeaux”. The question wants the example that is given.', 'des cadeaux pour votre famille')],
 15: [('C', 'This statement is never said about any of the friends: it is the extra one.', '')],
 16: [('C', 'This statement is never said about any of the friends: it is the extra one.', '')],
 17: [('C', 'This statement is never said about any of the friends: it is the extra one.', '')],
 18: [('C', 'This statement is never said about any of the friends: it is the extra one.', '')],
 19: [('C', 'This statement is never said about any of the friends: it is the extra one.', '')],
 20: [('A', 'You will hear “des milliers d’euros”. Listen to what Aubin himself took home.', 'des milliers d’euros')],
 21: [('A', 'You will hear about sport (“épreuves sportives”). Listen to whether he had to do any.', 'pas d’épreuves sportives')],
 22: [('C', 'You will hear about clothes (“s’habiller”). Listen to who chose them.', 'on pouvait s’habiller comme on voulait')],
 23: [('B', 'You will hear about the stress of being on TV. Check whether it is what Aubin says, or what people THINK.', 'le stress d’être à la télé')],
 24: [('B', 'You will hear about the lights (“projecteurs”). Listen to what Aubin says about them.', 'à cause des projecteurs')],
 25: [('B', 'You will hear about a written test (“épreuve écrite”). Listen to which shows it is for.', 'Pour d’autres jeux, ils doivent aussi passer une épreuve écrite')],
 26: [('C', 'You will hear “spectateurs”. Listen to whether they are there for this part.', 'Il n’y a pas de spectateurs')],
 27: [('A', 'You will hear “intelligent”. Is it the most important quality for Donia?', 'plus important que quelqu’un de très intelligent')],
 28: [('B', 'You will hear “danser”. Does Donia ask for it?', 'On ne leur demande pas de danser')],
 29: [('C', 'You will hear about pupils (“écoliers”) cleaning. Check exactly what they cleaned.', 'ont nettoyé leur quartier'), ('D', 'You will hear “130 000”. Check whether that is Toulouse or somewhere else.', 'dans toute la France, 130 000 participants')],
 30: [('B', 'You will hear about glass bottles. Check WHO collected them.', 'Un de mes collègues s’est chargé d’une collecte de bouteilles en verre')],
 31: [('A', 'You will hear about renting (“louer”). Listen to whether Athéna did.', 'Elle aurait pu en louer une'), ('D', 'You will hear about an evening dress. Check WHOSE dress it was.', 'la robe de soirée de sa meilleure copine')],
 32: [('A', 'You will hear about the number of devices (“huit appareils”, “très peu”). Check who has how many.', 'j’en ai très peu'), ('B', 'You will hear about old phones. Listen to where people keep them.', 'garder leurs anciens portables dans des tiroirs')],
 33: [('A', 'You will hear “piles” described as difficult. Compare with what he says next.', 'les piles sont très difficiles à recycler'), ('C', 'You will hear “microplastiques” described as a disaster. Compare with what he says next.', 'Les microplastiques aussi sont une catastrophe')],
 34: [('A', 'You will hear about sorting (“trier”). Is it what he calls the MOST important?', 'continuer à trier le plus possible'), ('D', 'You will hear about taking part in eco projects. Is it the MOST important?', 'participer à ces projets écologiques')],
 35: [('B', 'You will hear “la vie de château n’est pas une vie de rêve”. Read the statement again carefully.', 'la vie de château n’est pas une vie de rêve'), ('D', 'You will hear about the cost of repairs. Compare the numbers carefully.', 'coûtent deux fois plus cher que pour une maison')],
 36: [('C', 'You will hear about the American group and how long they stay. Listen to the exact length.', 'pour un long week-end'), ('D', 'You will hear about a tour guide. Listen to who will be the guide.', 'elle va aussi jouer le rôle de guide touristique')],
 37: [('A', 'You will hear about a travel agency. Listen to whether it has already started.', 'doit venir bientôt'), ('C', 'You will hear about Marina’s birthday. Check WHERE she celebrated it.', 'dans un château en Suisse')],
}
# safety check: leaving at least len(answer)+1 options un-flagged
for _q in Q:
    _fl = {l for (l, n_, q_) in DX.get(_q['n'], []) if l}
    assert len(_q['opts']) - len(_fl) >= len(_q['ans']) + 1, ('DX reveals the answer', _q['n'])
    assert not (_fl & set(_q['ans'])), ('DX flags a correct option', _q['n'])

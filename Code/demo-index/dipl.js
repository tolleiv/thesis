
/**
    Demo queries:

    /solr/select/?q=*%3A*&indent=on&fl=*,score,dist(2,vector(0.57,-1.01,0.66,0.11),features)&debugQuery=on
    /solr/select/?qq=*:*&b=div(1,dist(2,vector(0.57,-1.01,0.66,0.10),features))&q=%7B!boost%20b=$b%20v=$qq%7D&fl=*,score&debugQuery=on

    /solr/select/?qq=*:*&v=vector(0.57,-1.01,0.66,0.11)&b=div(1,dist(2,$v,features))&q=%7B!boost%20b=$b%20v=$qq%7D&fl=*,score&debugQuery=on
    /solr/select/?qq=content:Josef&v=vector(0.57,-1.01,0.66,0.11)&b=div(1,dist(2,$v,features))&q=%7B!boost%20b=$b%20v=$qq%7D&fl=*,score&debugQuery=on

    
    qq = *:*
    b = div(1, dist(2,$v, features))
    v = vector(0.57,-1.01,0.66,0.11)
    q = {!boost b=$b defType=dismax v=$qq} 

**/


var solr = require('solr');

var solrConf = {
    core:'',
    port:8080
};

var client = solr.createClient(solrConf);

var docs = [
{   id: 1,
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris. Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis dolor. Praesent et diam eget libero egestas mattis sit amet vitae augue. Nam tincidunt congue enim, ut porta lorem lacinia consectetur. Donec ut libero sed arcu vehicula ultricies a non tortor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut gravida lorem. Ut turpis felis, pulvinar a semper sed, adipiscing id dolor. Pellentesque auctor nisi id magna consequat sagittis. Curabitur dapibus enim sit amet elit pharetra tincidunt feugiat nisl imperdiet. Ut convallis libero in urna ultrices accumsan. Donec sed odio eros. Donec viverra mi quis quam pulvinar at malesuada arcu rhoncus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In rutrum accumsan ultricies. Mauris vitae nisi at sem facilisis semper ac in est.',
    date: (new Date()).toISOString(),
    cat_s: '1',
    features:'0.57,-1.01,0.66,0.10'
},
{   id: 2,
    content: 'Eine wunderbare Heiterkeit hat meine ganze Seele eingenommen, gleich den süßen Frühlingsmorgen, die ich mit ganzem Herzen genieße. Ich bin allein und freue mich meines Lebens in dieser Gegend, die für solche Seelen geschaffen ist wie die meine. Ich bin so glücklich, mein Bester, so ganz in dem Gefühle von ruhigem Dasein versunken, daß meine Kunst darunter leidet. Ich könnte jetzt nicht zeichnen, nicht einen Strich, und bin nie ein größerer Maler gewesen als in diesen Augenblicken. Wenn das liebe Tal um mich dampft, und die hohe Sonne an der Oberfläche der undurchdringlichen Finsternis meines Waldes ruht, und nur einzelne Strahlen sich in das innere Heiligtum stehlen, ich dann im hohen Grase am fallenden Bache liege, und näher an der Erde tausend mannigfaltige Gräschen mir merkwürdig werden; wenn ich das Wimmeln der kleinen Welt zwischen Halmen, die unzähligen, unergründlichen Gestalten der Würmchen, der Mückchen näher an meinem Herzen fühle, und fühle die Gegenwart des Allmächtigen, der uns nach seinem Bilde schuf, das Wehen des Alliebenden, der uns in ewiger Wonne schwebend trägt und erhält; mein Freund! Wenn\'s dann um meine Augen dämmert, und die Welt um mich her und der Himmel ganz in meiner Seele ruhn wie die Gestalt einer',
    date: (new Date()).toISOString(),
    cat_s: '1',
    features:'0.32,0.26,0.84,0.10'
},
{   id: 3,
    content: 'Jemand musste Josef K. verleumdet haben, denn ohne dass er etwas Böses getan hätte, wurde er eines Morgens verhaftet. »Wie ein Hund! « sagte er, es war, als sollte die Scham ihn überleben. Als Gregor Samsa eines Morgens aus unruhigen Träumen erwachte, fand er sich in seinem Bett zu einem ungeheueren Ungeziefer verwandelt. Und es war ihnen wie eine Bestätigung ihrer neuen Träume und guten Absichten, als am Ziele ihrer Fahrt die Tochter als erste sich erhob und ihren jungen Körper dehnte. »Es ist ein eigentümlicher Apparat«, sagte der Offizier zu dem Forschungsreisenden und überblickte mit einem gewissermaßen bewundernden Blick den ihm doch wohlbekannten Apparat. Sie hätten noch ins Boot springen können, aber der Reisende hob ein schweres, geknotetes Tau vom Boden, drohte ihnen damit und hielt sie dadurch von dem Sprunge ab. In den letzten Jahrzehnten ist das Interesse an Hungerkünstlern sehr zurückgegangen. Aber sie überwanden sich, umdrängten den Käfig und wollten sich gar nicht fortrühren. Jemand musste Josef K. verleumdet haben, denn ohne dass er etwas Böses getan hätte, wurde er eines Morgens verhaftet. »Wie ein Hund! « sagte er, es war, als sollte die Scham ihn überleben. Als Gregor Samsa eines Morgens aus unruhigen Träumen erwachte, fand er sich',
    date: (new Date()).toISOString(),
    cat_s: '2',
    features:'-0.15,1.50,0.84,0.10'
},
{   id: 4,
    content: 'Zahmen, by Matsch Flow bewarb kam cm Zipfeln trolle et Vorgangs. Heldin Bear erlahmtet gem Fata vor Eklat elf Düfte. Katz bunte Boy eiserner Frl Blick Dom Car löschen ade versandten eure pro Griff. Zofe auf säurebeständigster, bestreichte Extension, frustrierenderes Neon Dur Empfangsdamen Eckzimmer, Box to Regisseur Euch tov Viele wartet, fasst Arms zus rufe Fells wer traü ruhigem fischtest. Jede.',
    date: (new Date()).toISOString(),
    cat_s: '2',
    features:'0.69,-0.29,1.66,0.10'
},
{   id: 5,
    content: 'Eiche dranget. Schafe Werden warme abwaschend mix Arrest winkt erbot zuschickende Die Ahle. Riege Abteile enden wo triebe Embyro dich begutachtest Novum neu, lacht ja an stehlen Bzw rüstigerem Alle zeitiges Urstoffe brüllend Nils hinhörend es gab Archiven Aufzugs kg zus Golfs wog haust lobe dumpf Deal ernte gedaürte, Backup Erle würdest, Beo Pflanzern macht Efeu gesagt Die hoi hobet Lucrezia Gauk.',
    date: (new Date()).toISOString(),
    cat_s: '3',
    features:'0.65,0.58,0.98,0.10'
},
{   id: 6,
    content: 'Cherzest einfliesst Spore turne taü nie Viaduktes Cha Rein, forme Egal zeitig Lenins im Abteile eher Heidin einsatzbereiter Dänin Gauda Kerlen, beizuwohen abgedrückten. Abo lieber Lydien oh sozialem AfA gen unergiebig tot lähme altmodischem AfA vorteilhafte. Stk telegrafiertes Golde Co Puma Flaute Eid weis, gar reimt er Aktenpaket, hie Box Tadel Genfer Gerbmittel Alle per Fichten leb Dandy abgewü.',
    date: (new Date()).toISOString(),
    cat_s: '3',
    features:'0.59,0.49,1.07,0.10'
},
{   id: 7,
    content: 'Jemand musste Josef K. verleumdet haben, denn ohne dass er etwas Böses getan hätte, wurde er eines Morgens verhaftet. »Wie ein Hund! « sagte er, es war, als sollte die Scham ihn überleben. Als Gregor Samsa eines Morgens aus unruhigen Träumen erwachte, fand er sich in seinem Bett zu einem ungeheueren Ungeziefer verwandelt. Und es war ihnen wie eine Bestätigung ihrer neuen Träume und guten Absichten, als am Ziele ihrer Fahrt die Tochter als erste sich erhob und ihren jungen Körper dehnte. »Es ist ein eigentümlicher Apparat«, sagte der Offizier zu dem Forschungsreisenden und überblickte mit einem gewissermaßen bewundernden Blick den ihm doch wohlbekannten Apparat. Sie hätten noch ins Boot springen können, aber der Reisende hob ein schweres, geknotetes Tau vom Boden, drohte ihnen damit und hielt sie dadurch von dem Sprunge ab. In den letzten Jahrzehnten ist das Interesse an Hungerkünstlern sehr zurückgegangen. Aber sie überwanden sich, umdrängten den Käfig und wollten sich gar nicht fortrühren. Jemand musste Josef K. verleumdet haben, denn ohne dass er etwas Böses getan hätte, wurde er eines Morgens verhaftet. »Wie ein Hund! « sagte er, es war, als sollte die Scham ihn überleben. Als Gregor Samsa eines Morgens aus unruhigen Träumen erwachte, fand er sich',
    date: (new Date()).toISOString(),
    cat_s: '4',
    features:'0.82,0.20,1.28,0.10'
}];

for (var doc in docs) {
    client.add(docs[doc], function (err) {
	if (err) { console.log(err); }
	client.commit();
    });
}



Gestionare Inventar Bricolaj

Gestionare Inventar Bricolaj este o aplicație web creată cu React pentru gestionarea unui inventar într-un magazin de bricolaj. Aplicația permite adăugarea, ștergerea, actualizarea și vizualizarea articolelor din inventar, precum și gestionarea categoriilor și stocurilor.

Funcționalități

- Adăugare/Ștergere Articole: Permite adăugarea și ștergerea articolelor din inventar.
- Gestionare Stocuri: Permite monitorizarea stocurilor pentru fiecare articol.
- Căutare și Filtrare: Căutarea rapidă și filtrarea articolelor după nume sau categorie.
- Interfață prietenoasă: O interfață simplă și intuitivă pentru utilizatori.

Cerințe

Pentru a rula aplicația pe mașina locală, trebuie să ai următoarele instalate:

- Node.js - Asigură-te că ai instalat Node.js pe sistemul tău. Poți descărca Node.js de la https://nodejs.org/.
- npm - Managerul de pachete pentru Node.js (de obicei vine împreună cu Node.js).

Instalare

Pentru a configura proiectul local, urmează pașii de mai jos:

1. Clonează repository-ul

git clone https://github.com/Copernicus12/Gestionare-Inventar-Bricolaj.git

2. Navighează în directorul proiectului

cd Gestionare-Inventar-Bricolaj

3. Instalează dependențele

Instalează toate pachetele necesare folosind npm:

npm install

Acest comandă va instala toate pachetele listate în fișierul package.json al proiectului.

4. Lansează aplicația

După ce dependențele sunt instalate, poți porni aplicația cu:

npm start

Aplicația va fi accesibilă în browser la adresa http://localhost:3000, modificare ulteriara vite.config.js pentru port

cd backend si node server.js pentru comunicarea cu MongoDB si fetch ul datelor

Utilizare

Odată ce aplicația este rulată, poți utiliza următoarele funcționalități:

- Adăugarea de articole: Poți adăuga articole în inventar completând câmpurile necesare (nume, descriere, preț, cantitate).
- Vizualizarea inventarului: Vezi lista completă de articole din inventar.
- Căutarea articolelor: Căută articole după nume, categorie sau alte caracteristici.
- Actualizarea articolelor: Modifică detalii precum cantitatea, prețul sau descrierea articolelor.
- Ștergerea articolelor: Poți elimina articole care nu mai sunt necesare.

Structura Proiectului

Iată o descriere a principalelor fișiere și directoare din proiect:

Gestionare-Inventar-Bricolaj/
├── public/
│   ├── index.html          # Fișierul principal HTML
├── src/
│   ├── components/         # Componentele React
│   ├── App.js              # Componența principală a aplicației
│   ├── index.js            # Punctul de intrare al aplicației React
├── package.json            # Dependențele și configurațiile proiectului
├── README.md               # Documentația proiectului (acest fișier)
└── .gitignore              # Fișierele care nu sunt urmărite de Git

Contribuții

Dacă dorești să contribui la proiect, te rugăm să urmezi acești pași:

1. Fă un fork al repository-ului.
2. Creează o ramură nouă (git checkout -b feature-noua).
3. Fă modificările necesare și adaugă un commit (git commit -am 'Adaugă funcționalitatea nouă').
4. Pushează modificările (git push origin feature-noua).
5. Creează un Pull Request.

Licență

Acest proiect este licențiat sub Licența MIT - vezi fișierul LICENSE pentru detalii.

- GitHub: https://github.com/Copernicus12

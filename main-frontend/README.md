<h1 class="code-line" data-line-start=0 data-line-end=1 ><a id="Frontend_Jenis_Company_0"></a>Frontend Jenis Company</h1>
<ul>
<li class="has-line-data" data-line-start="1" data-line-end="2">React frontend</li>
<li class="has-line-data" data-line-start="2" data-line-end="3">SCSS styles</li>
<li class="has-line-data" data-line-start="3" data-line-end="5">Bingo37 Game table on pure js</li>
</ul>
<h2 class="code-line" data-line-start=5 data-line-end=6 ><a id="Description_5"></a>Description</h2>
<p class="has-line-data" data-line-start="6" data-line-end="8">The frontend is made on React. All items are arranged in folders. The project structure is close to the requirements of atomic design, slightly corrected: improved and refined.<br>
Learn more about the src folder structure:</p>
<ul>
<li class="has-line-data" data-line-start="8" data-line-end="9">app.js - here we have react-routing (here you can register new pages)</li>
<li class="has-line-data" data-line-start="9" data-line-end="10">PAGES - folder for pages</li>
<li class="has-line-data" data-line-start="10" data-line-end="11">GAMES - folder for games (now there is only Bingo37)</li>
<li class="has-line-data" data-line-start="11" data-line-end="12">BLOCKS - there are independent page elements: sections or blocks</li>
<li class="has-line-data" data-line-start="12" data-line-end="13">ELEMENTS - it’s folder for repeated small parts of the interface</li>
<li class="has-line-data" data-line-start="13" data-line-end="15">ATOMS - there are the smallest parts of the website, for example, there is a button, a search bar, a drop-down list, etc.</li>
</ul>
<p class="has-line-data" data-line-start="15" data-line-end="16">Next to the SRC folder is the PUBLIC folder, there is an html page template and some useful files like favicon and robots.txt</p>
<h2 class="code-line" data-line-start=17 data-line-end=18 ><a id="Installation_17"></a>Installation</h2>
<p class="has-line-data" data-line-start="18" data-line-end="21">You can use compiled version of frontend Jenis or you can start development mode.<br>
Compiled version is ready for deployment on a virtual server and is located in the DIST folder of this project.<br>
To start devMode (please note that you need to change package.json with correct paths to SSL certs):</p>
<pre><code class="has-line-data" data-line-start="22" data-line-end="26" class="language-sh">$ <span class="hljs-built_in">cd</span> bingo37
$ npm install
$ npm start
</code></pre>
<p class="has-line-data" data-line-start="26" data-line-end="27">To compile dev version to production use:</p>
<pre><code class="has-line-data" data-line-start="28" data-line-end="30" class="language-sh">$ npm run build
</code></pre>
<p class="has-line-data" data-line-start="26" data-line-end="27">To start production server using SERVE you need to use command (please note that you need to change port and specify the correct path for SSL certificates): </p>
<pre><code class="has-line-data" data-line-start="28" data-line-end="30" class="language-sh">$ nserve -s build --ssl-cert ./sslcert/certificate.crt --ssl-key ./sslcert/private.key -l 9667
</code></pre>
<p class="has-line-data" data-line-start="30" data-line-end="31">Be careful: please note that you need to go to the utils folder and in the ENVIROMENT.js and API.js change your site's address and domain.</p>
<p class="has-line-data" data-line-start="32" data-line-end="33">Both the frontend and backend must be under HTTPS</p>
<h2 class="code-line" data-line-start=37 data-line-end=38 ><a id="Bingo37_Game_Table_docs_37"></a>Bingo37 Game Table docs</h2>
<p class="has-line-data" data-line-start="38" data-line-end="39">For generate new documentation (when you change comments in watched files):</p>
<pre><code class="has-line-data" data-line-start="40" data-line-end="42" class="language-sh">$ npm run docs
</code></pre>
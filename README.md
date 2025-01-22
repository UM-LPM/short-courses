# Pregled kratkih izobraževanj

## Zagon

```bash
  bundle install
```

```bash
   bundle exec jekyll serve
```

## Slike

Slike so prikazane iz  URL iz [unsplash](https://unsplash.com) in trenutno niso shranjene lokalno.

Če želite zagnati skripto za spreminjanje velikosti slik, ki so v mapi assets/img/downloaded, morate namestiti program [ImageMagic](https://imagemagick.org/script/download.php). 
Nato je treba zagnati skripto **image-resize.sh** bash. 

Najprej dodajte pravice za izvajanje:
```bash
   chmod +x image-resize.sh
```
Nato zaženite skripto:
```bash
   ./image-resize.sh 
```
Slike s spremenjeno velikostjo bodo shranjene v mapah **assets/img/1024**, **assets/img/512** in **assets/img/256**.

## Namestitev na strežnik

Za namestitev na strežnik je potrebno generirati `Gemfile.lock` in `gemset.nix` z ukazom:

```
nix run .#bundix -- -l
```

- [Dokumentacija](https://nixos.org/manual/nixpkgs/stable/#developing-with-ruby)

## Uvoz podatkov

### Format csv
V mapi s **script** se nahaja python skripta, ki sprejme tabelo v obliko .csv in pretvori podatke v Markdown, ter shrani v _posts, za uniformen prikaz podatkov.


## Serviranje v formatu json
Stran tudi ustvari in servira podatke:
- [Vsa izobraževanja: /course-data.json](https://pmd.lpm.feri.um.si/course-data.json)
- [Vsa izobraževanja brez šumnikov: /course-data-filtered.json](https://pmd.lpm.feri.um.si/course-data-filtered.json)
- [Ključne besede, tags, značke: /tag-data.json](https://pmd.lpm.feri.um.si/tag-data.json)

## Zasluge
### Jekflix Template za stran

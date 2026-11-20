---
layout: page
menu: false
date: "2026-11-12 10:00:00"
title: Pogoji, politika zasebnosti in dostopnost
title_en: Terms, privacy policy and accessibility
description: Pogoji, politika zasebnosti in dostopnost
permalink: /pomoc-uporabnikom/
---

{% assign helpGroups = site.data.catalog.documents | group_by: "section" | sort: "name" %}

<div class="help-page" markdown="0">
    <div class="help-page__header">
        <h2 class="help-page__title"><span data-sl>Pogoji, politika zasebnosti in dostopnost</span><span data-en>Terms, privacy policy and accessibility</span></h2>
        <p class="help-page__lead"><span data-sl>Splošni pogoji, varstvo osebnih podatkov, izjava o dostopnosti in drugi uporabni dokumenti.</span><span data-en>General terms and conditions, personal data protection, the accessibility statement and other useful documents.</span></p>
    </div>

    {% if helpGroups.size == 0 %}
    <p class="help-page__empty"><span data-sl>Trenutno ni objavljenih dokumentov.</span><span data-en>There are currently no published documents.</span></p>
    {% endif %}

    {% for group in helpGroups %}
    {% if helpGroups.size > 1 %}
    {% assign namedEn = group.items | where_exp: "item", "item.sectionEn" | first %}
    <h3 class="help-page__group-title">{% if group.name == "" %}<span data-sl>Drugi dokumenti</span><span data-en>Other documents</span>{% else %}<span data-sl>{{ group.name }}</span><span data-en>{{ namedEn.sectionEn | default: group.name }}</span>{% endif %}</h3>
    {% endif %}
    {% assign groupDocuments = group.items | sort: "titleSl" %}
    <ul class="help-cards">
        {% for document in groupDocuments %}
        {% assign mime = document.mimeType | default: "" %}
        {% if document.pageUrl %}{% assign icon = "fa-file-alt" %}{% elsif mime == "application/pdf" %}{% assign icon = "fa-file-pdf" %}{% elsif mime contains "word" or mime contains "opendocument.text" %}{% assign icon = "fa-file-word" %}{% elsif mime contains "spreadsheet" or mime contains "excel" %}{% assign icon = "fa-file-excel" %}{% elsif mime contains "presentation" or mime contains "powerpoint" %}{% assign icon = "fa-file-powerpoint" %}{% else %}{% assign icon = "fa-file-alt" %}{% endif %}
        {% capture cardBody %}
                <span class="help-card__icon" aria-hidden="true"><i class="fas {{ icon }}"></i></span>
                <span class="help-card__body">
                    <span class="help-card__title"><span data-sl>{{ document.titleSl }}</span><span data-en>{{ document.titleEn | default: document.titleSl }}</span></span>
                    {% if document.descriptionSl %}<span class="help-card__description"><span data-sl>{{ document.descriptionSl }}</span><span data-en>{{ document.descriptionEn | default: document.descriptionSl }}</span></span>{% endif %}
                </span>
                {% if document.pageUrl %}
                <span class="help-card__open" aria-hidden="true"><i class="fas fa-arrow-right"></i></span>
                {% else %}
                <span class="help-card__open" aria-hidden="true"><i class="fas fa-external-link-alt"></i></span>
                <span class="screen-reader-only"><span data-sl>(odpre se v novem zavihku)</span><span data-en>(opens in a new tab)</span></span>
                {% endif %}
        {% endcapture %}
        <li class="help-cards__item">
            {% if document.pageUrl %}
            <a class="help-card" href="{{ document.pageUrl | prepend: site.baseurl }}">{{ cardBody }}</a>
            {% elsif document.urlEn %}
            <a class="help-card" data-sl href="{{ document.url }}" target="_blank" rel="noopener noreferrer">{{ cardBody }}</a>
            <a class="help-card" data-en href="{{ document.urlEn }}" target="_blank" rel="noopener noreferrer">{{ cardBody }}</a>
            {% else %}
            <a class="help-card" href="{{ document.url }}" target="_blank" rel="noopener noreferrer">{{ cardBody }}</a>
            {% endif %}
        </li>
        {% endfor %}
    </ul>
    {% endfor %}
</div>

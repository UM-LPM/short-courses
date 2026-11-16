---
layout: page
menu: false
date: "2026-11-12 10:00:00"
title: Pomoč uporabnikom
description: Pomoč uporabnikom
permalink: /pomoc-uporabnikom/
---

{% assign helpGroups = site.data.catalog.documents | group_by: "section" | sort: "name" %}

<div class="help-page" markdown="0">
    <div class="help-page__header">
        <h2 class="help-page__title"><span data-sl>Pomoč uporabnikom</span><span data-en>User support</span></h2>
        <p class="help-page__lead"><span data-sl>Navodila, pogoji uporabe in drugi uporabni dokumenti. Dokument se odpre v novem zavihku.</span><span data-en>Guides, terms of use and other useful documents. Each document opens in a new tab.</span></p>
    </div>

    {% if helpGroups.size == 0 %}
    <p class="help-page__empty"><span data-sl>Trenutno ni objavljenih dokumentov.</span><span data-en>There are currently no published documents.</span></p>
    {% endif %}

    {% for group in helpGroups %}
    {% if helpGroups.size > 1 %}
    <h3 class="help-page__group-title">{% if group.name == "" %}<span data-sl>Splošni dokumenti</span><span data-en>General documents</span>{% else %}{{ group.name }}{% endif %}</h3>
    {% endif %}
    {% assign groupDocuments = group.items | sort: "titleSl" %}
    <ul class="help-cards">
        {% for document in groupDocuments %}
        {% assign mime = document.mimeType | default: "" %}
        {% if mime == "application/pdf" %}{% assign icon = "fa-file-pdf" %}{% elsif mime contains "word" or mime contains "opendocument.text" %}{% assign icon = "fa-file-word" %}{% elsif mime contains "spreadsheet" or mime contains "excel" %}{% assign icon = "fa-file-excel" %}{% elsif mime contains "presentation" or mime contains "powerpoint" %}{% assign icon = "fa-file-powerpoint" %}{% else %}{% assign icon = "fa-file-alt" %}{% endif %}
        <li class="help-cards__item">
            <a class="help-card" href="{{ document.url }}" target="_blank" rel="noopener noreferrer">
                <span class="help-card__icon" aria-hidden="true"><i class="fas {{ icon }}"></i></span>
                <span class="help-card__body">
                    <span class="help-card__title"><span data-sl>{{ document.titleSl }}</span><span data-en>{{ document.titleEn | default: document.titleSl }}</span></span>
                    {% if document.descriptionSl %}<span class="help-card__description"><span data-sl>{{ document.descriptionSl }}</span><span data-en>{{ document.descriptionEn | default: document.descriptionSl }}</span></span>{% endif %}
                </span>
                <span class="help-card__open" aria-hidden="true"><i class="fas fa-external-link-alt"></i></span>
                <span class="screen-reader-only"><span data-sl>(odpre se v novem zavihku)</span><span data-en>(opens in a new tab)</span></span>
            </a>
        </li>
        {% endfor %}
    </ul>
    {% endfor %}
</div>

---
layout: page
menu: false
date: "2024-03-06 13:53:59"
title: Kontakt
title_en: Contact
description: Kontakt
permalink: /kontakt/
---

{% assign contactFaculty = site.data.catalog.faculty %}

## <span data-sl>Kontakt</span><span data-en>Contact</span>

{% if contactFaculty.title %}
**<span data-sl>{{ contactFaculty.title }}</span><span data-en>{{ contactFaculty.titleEn | default: contactFaculty.title }}</span>**{% if contactFaculty.address %}<br>
{{ contactFaculty.address }}{% endif %}{% if contactFaculty.phone %}<br>
{{ contactFaculty.phone }}{% endif %}{% if contactFaculty.email %}<br>
[{{ contactFaculty.email }}](mailto:{{ contactFaculty.email }}){% endif %}{% if contactFaculty.website %}<br>
[{{ contactFaculty.website | remove: "https://" | remove: "http://" }}]({{ contactFaculty.website }}){:target="_blank" rel="noopener noreferrer"}{% endif %}
{% endif %}

### <span data-sl>Tehnična pomoč pri prijavi</span><span data-en>Technical help with registration</span>

{% include protected-email.html encoded="aXMubXVAZWpuYWpsdmFycHUuZ29sYXRhaw==" %}

require "kramdown"

module Jekyll
  class TextDocumentPageGenerator < Generator
    safe true
    priority :lowest

    def generate(site)
      taken = site.pages.map(&:url)
      page_url_by_id = {}

      text_documents(site).each do |document|
        id = document["id"].to_s

        unless page_url_by_id.key?(id)
          page = TextDocumentPage.new(site, site.source, directory_for(document, taken), document)
          site.pages << page
          taken << page.url
          page_url_by_id[id] = page.url
        end

        document["pageUrl"] = page_url_by_id[id]
      end
    end

    private

    def text_documents(site)
      catalog = site.data["catalog"]
      documents = catalog.is_a?(Hash) ? Array(catalog["documents"]) : []
      Array(site.data["courses"]).each do |course|
        documents.concat(Array(course["documents"])) if course.is_a?(Hash)
      end

      documents.select do |document|
        document.is_a?(Hash) && document["kind"] == "text" && !document["contentSl"].to_s.strip.empty?
      end
    end

    def directory_for(document, taken)
      slug = Utils.slugify(document["titleSl"].to_s, mode: "latin")
      slug = "dokument" if slug.empty?
      taken.include?("/#{slug}/") ? "#{slug}-#{document['id'].to_s[0, 8]}" : slug
    end
  end

  class TextDocumentPage < Page
    def initialize(site, base, dir, document)
      @site = site
      @base = base
      @dir = dir
      @name = "index.html"

      process(@name)

      title_sl = document["titleSl"].to_s
      title_en = present(document["titleEn"]) || title_sl

      self.data = {
        "layout" => "page",
        "menu" => false,
        "title" => title_sl,
        "title_en" => title_en,
        "description" => present(document["descriptionSl"]) || title_sl,
        "text_document" => document["id"],
      }

      self.content = <<~HTML
        <div class="legal-page">
        <div data-sl="">
        #{section(title_sl, document["contentSl"])}
        </div>
        <div data-en="">
        #{section(title_en, present(document["contentEn"]) || document["contentSl"])}
        </div>
        </div>
      HTML
    end

    private

    def present(value)
      value.to_s.strip.empty? ? nil : value.to_s
    end

    def escape(text)
      text.to_s.gsub("&", "&amp;").gsub("<", "&lt;").gsub(">", "&gt;")
    end

    def section(title, markdown)
      body = Kramdown::Document.new(
        escape(markdown),
        input: "GFM",
        hard_wrap: true,
        header_offset: 1,
        auto_ids: false,
        smart_quotes: %w[apos apos quot quot]
      ).to_html

      body = body.gsub(/<a href="(https?:[^"]*)"/) do
        %(<a href="#{Regexp.last_match(1)}" target="_blank" rel="noopener noreferrer")
      end

      "<h1>#{escape(title)}</h1>\n#{body}".gsub("{", "&#123;").gsub("}", "&#125;")
    end
  end
end

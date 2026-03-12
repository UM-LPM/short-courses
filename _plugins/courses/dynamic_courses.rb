require "fileutils"
require "net/http"
require "uri"
require "dotenv/load"

module Jekyll
  class CoursePageGenerator < Jekyll::Generator
    safe true

    def generate(site)
      return unless site.data["courses"]

      syllabus_dir = File.join(site.source, "syllabus")
      FileUtils.mkdir_p(syllabus_dir)

      token = ENV["CMS_API_TOKEN"]

      site.data["courses"].each do |course|
        download_pdf(course, syllabus_dir, token)
        site.pages << CoursePage.new(site, site.source, course)
      end
    end

    private

    def download_pdf(course, syllabus_dir, token)
      pdf_url = course["pdfUrl"]
      return if pdf_url.nil? || pdf_url.strip.empty?

      uri = URI.parse(pdf_url)

      filename = "#{course["acronym"]}.pdf"
      local_path = File.join(syllabus_dir, filename)

      return if File.exist?(local_path)

      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = uri.scheme == "https"

      request = Net::HTTP::Get.new(uri)

      request["Authorization"] = "#{token}"

      response = http.request(request)

      if response.is_a?(Net::HTTPSuccess)
        File.binwrite(local_path, response.body)
        course["localPdfPath"] = "/syllabus/#{filename}"
        Jekyll.logger.info "PDF:", "Downloaded #{filename}"
      else
        Jekyll.logger.warn "PDF:", "Failed #{pdf_url} (#{response.code})"
      end
    rescue => e
      Jekyll.logger.warn "PDF:", e.message
    end
  end

  class CoursePage < Jekyll::Page
    def initialize(site, base, course)
      @site = site
      @base = base
      @dir = course["acronym"]
      @name = "index.html"

      self.process(@name)
      self.data = course
    end
  end
end
module Jekyll
  class CoursePageGenerator < Jekyll::Generator
    safe true

    def generate(site)
      if site.data["courses"]
        site.data["courses"].each do |course|
          site.pages << CoursePage.new(site, site.source, course)
        end
      end
    end
  end

  class CoursePage < Jekyll::Page
    def initialize(site, base, course)
      @site = site
      @base = base
      @dir = course["id"]
      @name = "index.html"

      self.process(@name)
      self.data = course
    end
  end
end

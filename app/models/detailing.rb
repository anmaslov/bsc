class Detailing < ActiveRecord::Base

  belongs_to :product, :class_name => "Product", :foreign_key => "product_id"

  has_attached_file :image, styles: {:medium => "300x300#", :thumb => "150x150>", :thumbnail => "50x50>"}
  validates_attachment_content_type :image, :content_type => ["image/jpg", "image/jpeg", "image/png", "image/gif"]

  has_attached_file :pdf, styles: {thumbnail: "60x60#"}
  validates_attachment_content_type :pdf, :content_type => ["application/pdf"]

  def image_from_url (url)

    url = 'http://www.arrows.ru' + url
    response = self.hopen(url)
    RestClient.get(url){|response, request, result|

      if result.message == "OK"

        if url =~ URI::regexp
          dd = URI.parse(url)
          req = Net::HTTP.new(dd.host, dd.port)
          req.read_timeout = 500
          request = Net::HTTP::Get.new(dd.request_uri)

          if dd.path != ""
            res = req.request_head(dd.path)
            if res.code == "200"
              self.image = URI.parse(url)
            end
            sleep(1.0/24.0)
          end
        end
      end
    }
  end

  def pdf_from_url (url)
    url = 'http://www.arrows.ru' + url
    response = self.hopen(url)
    RestClient.get(url){|response, request, result|

      if result.message == "OK"
        if url =~ URI::regexp
          dd = URI.parse(url)
          req = Net::HTTP.new(dd.host, dd.port)
          req.read_timeout = 500
          request = Net::HTTP::Get.new(dd.request_uri)
          if dd.path != ""
            res = req.request_head(dd.path)
            if res.code == "200"
              self.pdf = URI.parse(url)
            end
          end
        end
      end
    }
  end

  def self.hopen(url)
    begin
      open(url)
    rescue URI::InvalidURIError
      host = url.match(".+\:\/\/([^\/]+)")[1]
      path = url.partition(host)[2] || "/"
      Net::HTTP.get host, path
    end
  end

end

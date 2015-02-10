# encoding: utf-8
class Price < ActiveRecord::Base

  belongs_to :supplier
  belongs_to :supplier_import_information

  has_attached_file :file
  validates_attachment_content_type :file, :content_type => ["application/pdf","application/vnd.ms-excel",
                                                               "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                                                               "application/msword",
                                                               "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                                                               "text/plain"]

  def Price.load_price_regual
    #mails = Email.find(:all, :conditions => ["processing = :processing AND processed = :processed", {:processing => true, :processed => false}], :order => "created_at DESC")
    mails  = Email.where({processing: true, processed: false}).order('created_at DESC').all

    mails.each do |mail|
      supplier = mail.supplier
      #import_information = SupplierImportInformation.find(:first, :conditions => ["supplier_id = :supplier", {:supplier => supplier.id}])
      import_information  = SupplierImportInformation.where({supplier_id:  supplier.id}).order('created_at DESC').first
      #mail_attachments   = MailAttachment.find(:all, :conditions => ["email_id = :email_id", {:email_id => mail.id}], :order => "created_at DESC")
      mail_attachments  = MailAttachment.where({email_id: mail.id}).order('created_at DESC').all
      mail_attachments.each do |attach|
        filename = attach.filename
        self.import(filename, import_information)
      end
      mail.attributes = {:processed => true}
      mail.save!
    end
  end

  def self.import(file, import_information)

    file = file.split("?").first.to_s.encode("utf-8")
     #file.split("?").first.encoding
    spreadsheet = Roo::Excel.new(file) #open_spreadsheet(file)
    header = spreadsheet.row(1)
    (import_information.first_row..spreadsheet.last_row).each do |i|

      row = spreadsheet.row(i)

      supplier_id = import_information.supplier_id.to_i
      if row[import_information.article_column - 1].to_s !~ /^\s*[+-]?((\d+_?)*\d+(\.(\d+_?)*\d+)?|\.(\d+_?)*\d+)(\s*|([eE][+-]?(\d+_?)*\d+)\s*)$/ or import_information.supplier_id == 1
        article  = row[import_information.article_column - 1].to_s + '-' + import_information.supplier_id.to_s
      else
        if import_information.supplier_id != 1
          article  = row[import_information.article_column - 1].to_f.round(0).to_s + '-' + import_information.supplier_id.to_s
        else
          article  = row[import_information.article_column - 1].to_s + '-' + import_information.supplier_id.to_s
        end
      end

      product_id = nil
      if import_information.product_id.present?

        if row[import_information.product_id - 1].to_s !~ /^\s*[+-]?((\d+_?)*\d+(\.(\d+_?)*\d+)?|\.(\d+_?)*\d+)(\s*|([eE][+-]?(\d+_?)*\d+)\s*)$/ or import_information.supplier_id == 1
          article_parent  = row[import_information.product_id - 1].to_s + '-' + import_information.supplier_id.to_s
        else
          article_parent  = row[import_information.product_id - 1].round(0).to_s + '-' + import_information.supplier_id.to_s
        end

        parent_product = Product.find_by_article(article_parent)
        if parent_product.present?
          product_id = parent_product.id
        end
      end

      # characters = row[import_information.characters - 1].to_s
      # characters_title = row[import_information.characters - 1].to_s

      if import_information.characters.present? and import_information.characters_title.present?
        characters = import_information.characters.split(", ")
        characters_title = import_information.characters_title.split("~~")
      end

      title    = row[import_information.title_column - 1].to_s
      quantity = nil
      if import_information.quantity_column.present?
        quantity = row[import_information.quantity_column - 1].to_s.size
      end
      price    = row[import_information.price_column - 1].to_f
      if import_information.margin.present?
        price    = price + price * (import_information.margin.to_f / 100)
      end
      bar_code = nil
      if import_information.bar_code.present?
        bar_code = row[import_information.bar_code - 1].to_s
      end
      unit = nil
      if import_information.unit.present?
        unit     = row[import_information.unit - 1].to_s
      end

      if title.size > 0 and price > 0
        product = Product.find_by_article(article)

        if product.nil?
          product = Product.new
          product.attributes = {:title => title, :article => article, :price => price, :quantity => quantity,
                                :supplier_id => supplier_id, :catalog_id => $GC_ID + import_information.supplier_id, :is_active => false,
                                :product_id => product_id, :bar_code => bar_code, :unit => unit
          }
        else
          product.attributes = {:price => price, :quantity => quantity}
        end

        product.save!

        if characters.present? and characters_title.present?
          i = 0
          characters_title.each do |name|

            value = row[characters[i].to_i - 1].to_s

            character = Character.where(:product_id => product.id, :name => name).first
            if character.present?
              character.attributes = {:value => value}
            else
              character = Character.new
              character.attributes = {:value => value, :name => name, :product_id => product.id}
            end

            character.save
            i = i + 1
          end
        end

      end

      #row = Hash[[header, spreadsheet.row(i)].transpose]
      #product = find_by_id(row["id"]) || new
      #product.attributes = row.to_hash.slice(*accessible_attributes)
      #product.save!
    end
    true
  end

  def import
    #supplier = self.supplier
    Product.where(:supplier_id => supplier.id).update_all(:quantity => 0)
    if Price.import self.file.path, self.supplier_import_information
      self.processed = true
      self.save
      return true
    end
    false
  end

  def Price.update_info_arrow
    puts 'start parcing'
    require 'rubygems'
    require 'nokogiri'
    require 'rest_client'
    require 'oj'


    # Берез все товары, поставщиком которых являются Северные стрелы
    product_all = Product.where({supplier_id: 1, catalog_id: 777, is_processed: true}).order("id desc").all # .order("id asc").limit(100)

    puts 'priduct size: ' + product_all.size.to_s
    product_all.each do |product|
      # Ищем в поиске по артикулу

      #art = product.article[0..(product.article.size-3)].split('.')

      art = product.article[0..(product.article.size-3)].split('.')
      first_word = product.title.split(' ').first

      if art.size > 1
        art = art.first
        url = "http://www.arrows.ru/e_shop/search/?search=" + art + ' ' + first_word
      else
        url = "http://www.arrows.ru/e_shop/search/?search=" + product.article[0..(product.article.size-3)]
      end


      url.gsub!("?discount", "")
      puts '71 ' + url

      # Вся информация в скриптах
      url = URI.encode(url)

      # Если Url в порядке
      if url =~ URI::regexp

        #response = hopen(url)

        RestClient.get(url){|response, request, result|

        if result.message == "OK"
          page = Nokogiri::HTML(response)

          script = page.css("script")[7].text
          # Если они есть
          if script.length > 0

            # Забираем первый
            string = /\{(.+)\}/.match(script)
            string = string.to_s.split("}, {");
            if (string.size > 1)
              string = string[0] + "}"
            else
              string = string[0]
            end

            # Распарсиваем Json
            hash = Oj.load( string.to_s )

            # Если он распарсился
            if !hash.nil? and hash['url'] != nil and hash['url'] != ""
              parsing_product(product, hash['url'], hash['image'])
            end
          end
        end
        }
      end
      product.is_processed = true
      sleep(2)
      product.save
    end
  end

  def self.parsing_product(product, url, img_href)
    sleep(2)
    require 'rubygems'
    require 'nokogiri'
    require 'rest_client'
    require 'oj'

    # Получаем страницу с нужным товаром
    href = "http://www.arrows.ru" + url.to_s
    page_product_href = URI.encode(href)
    page_product_href.gsub!("?discount", "")
    puts '124 ' +  page_product_href
    #response = hopen(page_product_href)
    RestClient.get(page_product_href){|response, request, result|

      if result.message == "OK"
        page_product = Nokogiri::HTML(response)

        #page_product = Nokogiri::HTML(RestClient.get(page_product_href))

        #product.title

        title_new = page_product.css(".product_detail_title h1").text

        title_new = title_new.split(' арт. ').first.strip

        product.title = title_new
        puts product.title
        product.image_from_url 'http://www.arrows.ru' + img_href

        new_product = Hash.new
        new_product["article"] = page_product.css(".product_detail_title span").text

        if product.article.nil?
          product.article = new_product["article"]
        end

        #Хлебные крошки
        breadcrumb = String.new
        parent_id = 0
        new_catalog_id = 0

        # Пиздим картинки
        page_product.css(".productimage a.big_image").each do |link|
          image = ProductImg.new
          image.product = product
          if link['href'].present?
            image.picture_from_url 'http://www.arrows.ru' + link['href']
            image.save
          end
        end

        # Воссоздаем родительские каталоги до корня
        page_product.css(".breadcrumb a").each do |link|
          item_bread = Hash.new
          item_bread["title"] = link.content
          item_bread["href"]  = link['href']

          if item_bread["title"] != "Главная стрaница" || item_bread["href"] != "/"
            catalog = Catalog.new



            catalog.title = item_bread["title"]

            if parent_id == 0
              catalog.parent_id = 0
            else
              catalog.parent = Catalog.find(parent_id)
            end

            old_product = Catalog.where({:title => catalog.title, :parent_id => parent_id}).pop

            if old_product.nil? # or old_product.parent_id != parent_id
              catalog.description = catalog.title
              catalog.save
              new_catalog_id = catalog.id
              parent_id = catalog.id
            else
              parent_id = old_product.id
              new_catalog_id = parent_id
            end

          else
            parent_id = 0
            new_catalog_id = 0
          end
        end

        # если есть id родительского каталога
        if !new_catalog_id.nil? && new_catalog_id != 0
          product.catalog = Catalog.find(new_catalog_id)
        end

        # Характеристики
        characters = Hash.new
        i = 0
        page_product.css(".list_character li").each do |li|
          item = Hash.new
          item["name"] = li.css(".db_param_name").text
          item["value"] = li.css(".db_param_value").text
          characters[i] = item

          i = 0
          product.characters.each do |char|
            if char.value == item["value"] and char.name == item["name"]
              i = 1
            end
          end

          if i == 0
            ch = Character.new
            ch.name = item["name"]
            ch.value = item["value"]
            ch.product = product
            ch.save
          end
        end


        page_product.css(".box_character li").each do |li|
          item = Hash.new
          item["name"] = li.css(".db_param_name").text
          item["value"] = li.css(".db_param_value").text

          i = 0
          product.characters.each do |char|
            if char.value == item["value"] and char.name == item["name"]
              i = 1
            end
          end

          if i == 0
            ch = Character.new
            ch.name = item["name"]
            ch.value = item["value"]
            ch.product = product
            ch.save
          end
        end

        if !product.nil?
          product.save

          #Забираем деталировку
          detaining = Detailing.new
          detaining.product = product
          page_product.css(".sparepdf a").each do |link|
            if !link['href'].nil? and link['href'] != ""
              detaining.pdf_from_url link['href']
            end
          end

          page_product.css(".sparepdf .detail_img img").each do |link|
              if !link['src'].nil? and link['src'] != ""
                detaining.image_from_url link['src']
              end
          end

          if detaining.image.present? or detaining.pdf.present?
            detaining.save
          end

          #Забираем документы
          page_product.css(".dd_doc_document .big_image").each do |link|

            document = Document.new

            page_product_href = URI.encode(link['href'])
            page_product_href.gsub!("?discount", "")
            puts '238 ' +  page_product_href

              if link['href'] != nil and link['href'] != ""

                document.image_from_url link['href']
                document.product = product
                document.save
              end

          end

          #Пробегаемся по запчастям
          page_product.css(".sparestable .spitem").each do |tr|
            position = tr.css(".sp_pos").text
            tr.css(".sp_desc a").each do |h|
              href = h['href']
            end

            detail = Product.new
            #detail.position_detail = position.to_s
            #detail.detail_for_id = product.id
            detail.title = tr.css(".sp_desc a").text
            detail.price = tr.css(".sp_price .new_price").text.strip.gsub!(" ", "").gsub!("руб.", "").to_f
            detail_art = detail.title.split(' арт. ').second

            if !detail_art.nil?
              detail.article = detail_art.strip.gsub!(")", "") + '-det'
            end
            if href != nil and href != ""
              detail.save
              detail = Product.find_by_article(detail_art.strip.gsub!(")", "") + '-det')

              puts detail_art.strip.gsub!(")", "")

              #20300060-det

              if !detail.nil?
                det = Detail.new
                det.product_id = detail.id
                det.detail_for_id = product.id
                det.position_detail = position.to_s
                det.save
                # product.details << detail
                # hui = detail.id
                parsing_product(detail, href, '')
              end
            end
          end
        end
      end
    }
  end

  def self.open_spreadsheet(file)
    case File.extname(file.original_filename)
      when ".csv" then Csv.new(file.path, nil, :ignore)
      when ".xls" then Excel.new(file.path, nil, :ignore)
      when ".xlsx" then Excelx.new(file.path, nil, :ignore)
      else raise "Unknown file type: #{file.original_filename}"
    end
  end

  def self.hopen(url)
    dd = URI.parse(url)
    req = Net::HTTP.new(dd.host, dd.port)
    res = req.request_head(url)
      if res.code == "200"
      begin
        open(url)
      rescue URI::InvalidURIError
        host = url.match(".+\:\/\/([^\/]+)")[1]
        path = url.partition(host)[2] || "/"
        Net::HTTP.get host, path
      end
    end
  end

end



=begin
if (page_product.at("input#pprod_id") != nil)
  pprod_id = page_product.at("input#pprod_id")['value']

  diller_href = "http://www.dilkab.ru/e_shop/product/" + pprod_id.to_s

  diller_page = Nokogiri::HTML(RestClient.get(diller_href,
                                              {
                                                  :user_agent => "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.77.4 (KHTML, like Gecko) Version/7.0.5 Safari/537.77.4",
                                                  :Cookie => 'sessionid=7a4bd94c1a4a07d5890e97c3c4448cd9; _ym_visorc_24406210=w'
                                              }))
end
=end
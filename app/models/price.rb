class Price < ActiveRecord::Base

  def Price.load_price_regual
    mails = Email.find(:all, :conditions => ["processing = :processing AND processed = :processed", {:processing => true, :processed => false}], :order => "created_at DESC")

    mails.each do |mail|
      supplier = mail.supplier
      import_information = SupplierImportInformation.find(:first, :conditions => ["supplier_id = :supplier", {:supplier => supplier.id}])
      mail_attachments   = MailAttachment.find(:all, :conditions => ["email_id = :email_id", {:email_id => mail.id}], :order => "created_at DESC")
      mail_attachments.each do |attach|
        filename = attach.filename
        self.import(filename, import_information)
      end
      mail.attributes = {:processed => true}
      mail.save!
    end

    hui = 'pizda'
    pizda = 'hui'
  end

  def self.import(file, import_information)

    spreadsheet = Roo::Excel.new(file) #open_spreadsheet(file)
    header = spreadsheet.row(1)
    (import_information.first_row..spreadsheet.last_row).each do |i|

      row = spreadsheet.row(i)

      supplier_id = import_information.supplier_id.to_i
      article  = row[import_information.article_column - 1].to_s + '-' + import_information.supplier_id.to_s
      title    = row[import_information.title_column - 1].to_s
      quantity = row[import_information.quantity_column - 1].to_s.size
      price    = row[import_information.price_column - 1].to_f * (import_information.margin.to_f / 100)

      if title.size > 0 and price > 0
        product = Product.find_by_article(article)

        if product.nil?
          product = Product.new
          product.attributes = {:title => title, :article => article, :price => price, :quantity => quantity, :supplier_id => supplier_id, :catalog_id => $GC_ID, :is_active => false}
        else
          product.attributes = {:price => price, :quantity => quantity}
        end

        product.save!
      end

      #row = Hash[[header, spreadsheet.row(i)].transpose]
      #product = find_by_id(row["id"]) || new
      #product.attributes = row.to_hash.slice(*accessible_attributes)
      #product.save!
    end
  end

  def Price.update_info_arrow
    product_all = Product.where(supplier_id: 1).all

    require 'rubygems'
    require 'nokogiri'
    require 'rest_client'

    product_all.each do |product|

    url = "http://www.arrows.ru/e_shop/search/?search=" + product.article[0..(product.article.size-3)]
    page = Nokogiri::HTML(RestClient.get(url))
    script = page.css("script")[7].text

    if script.length > 0
      string = /\{(.+)\}/.match(script)
      hash = JSON.parse string.to_s
      href = "http://www.arrows.ru/" + hash['url']
      page_product = Nokogiri::HTML(RestClient.get(href))

      pprod_id = page_product.at("input#pprod_id")['value']

      diller_href = "http://www.dilkab.ru/e_shop/product/" + pprod_id.to_s + "/discont"

      diller_page = Nokogiri::HTML(RestClient.get(diller_href,
                                                  {
                                                      :user_agent => "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.77.4 (KHTML, like Gecko) Version/7.0.5 Safari/537.77.4",
                                                      :Cookie => 'sessionid=7a4bd94c1a4a07d5890e97c3c4448cd9; _ym_visorc_24406210=w'
                                                  }))

      product.description = page.css(".product-description").text

      new_product = Hash.new
      product.title = page_product.css(".product_detail_title h1").text
      new_product_aricle   = page_product.css(".product_detail_title span").text

      breadcrumb = String.new
      parent_id = 0
      new_catalog_id = 0
      page_product.css(".breadcrumb a").each do |link|
        item_bread = Hash.new
        item_bread["title"] = link.content
        item_bread["href"]  = link['href']

        if ( item_bread["title"] != "Главная стрaница" || item_bread["href"] != "/" )
          catalog = Catalog.new
          catalog.title = item_bread["title"]

          if parent_id == 0
            catalog.parent = nil
          else
            parent_catalog = Catalog.find(parent_id)
            catalog.parent = parent_catalog
          end

          old_product = Catalog.find_by_title(catalog.title)

          if (old_product.nil? or old_product.parent != catalog.parent)
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

      if new_catalog_id != nil
        product.catalog = Catalog.find(new_catalog_id)
      end
      #page_product = Nokogiri::HTML(RestClient.get(href))

      #puts page_product.css('html')

      #new_product_description = page_product.css(".dd_text")
      new_product['description'] = ''


      characters = Hash.new
      i = 0
      page_product.css(".list_character li").each do |li|
        item = Hash.new
        item["name"] = li.css(".db_param_name").text
        item["value"] = li.css(".db_param_value").text
        characters[i] = item
        i = i + 1
      end

      product.save

      diller_page.css(".product-images .product-image").each do |img|
        picture = ProductImg.new
        huk = "http://www.arrows.ru" + img['href']
        picture.picture_from_url "http://www.dilkab.ru" + img['href']
        picture.product = product
        picture.save
      end

      #remove_instance_variable(page_product)

    end

    end



  end

  def self.open_spreadsheet(file)
    case File.extname(file.original_filename)
      when ".csv" then Csv.new(file.path, nil, :ignore)
      when ".xls" then Excel.new(file.path, nil, :ignore)
      when ".xlsx" then Excelx.new(file.path, nil, :ignore)
      else raise "Unknown file type: #{file.original_filename}"
    end
  end

end

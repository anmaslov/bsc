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

  def self.open_spreadsheet(file)
    case File.extname(file.original_filename)
      when ".csv" then Csv.new(file.path, nil, :ignore)
      when ".xls" then Excel.new(file.path, nil, :ignore)
      when ".xlsx" then Excelx.new(file.path, nil, :ignore)
      else raise "Unknown file type: #{file.original_filename}"
    end
  end

end

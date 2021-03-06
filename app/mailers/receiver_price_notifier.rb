class ReceiverPriceNotifier < ActionMailer::Base
  default from: "receiver.price2@bsc-ltd.ru"

  def receive_regual
    Mail.defaults do
      retriever_method :imap, { :address             => "mail.bsc-ltd.ru",
                                :port                => 143,
                                :user_name           => 'receiver.price2@bsc-ltd.ru',
                                :password            => 'KqOYM86o',
                                :enable_ssl          => false }
    end

    mails = Mail.find(:what => :last, :count => 10, :order => :desc)

    #require 'pp'

    #pp mails.size

    if mails.kind_of?(Array)
      mails.each do |mail_item|

        attach = Array.new
        if mail_item.multipart?

          from = mail_item.header.fields.first.to_s
          subject = mail_item.subject
          body = mail_item.body.preamble + mail_item.body.epilogue
          message_id = mail_item.message_id.to_s

          office_attach = ''
          mail_item.parts.map { |p|

            content_type = p.content_type

            if /text\/plain/.match content_type
              body += p.body.decoded.force_encoding(p.charset).encode("UTF-8")
            elsif /application\/octet-stream/.match content_type or /multipart\/mixed/.match content_type
              content_type_parameters = p.content_type_parameters

              filename = content_type_parameters['name'].to_s

              if (FileTest::exist?($ROOT_PATH + "tmp/imap/#{message_id}") == false)
                Dir.mkdir($ROOT_PATH + "tmp/imap/#{message_id}")
              end

              File.open($ROOT_PATH + "tmp/imap/#{message_id}/#{filename}", 'wb') do |file|
                file.write(p.body.decoded)
              end
              attach.push($ROOT_PATH + "tmp/imap/#{message_id}/#{filename}")

              attachments.push(attach)
            elsif /application\/vnd.ms-office/.match content_type or /application\/x-excel/.match content_type
              content_type_parameters = p.content_type_parameters
              filename = content_type_parameters['name'].to_s
              office_attach += p.body.decoded
            end
          }

          if office_attach.size > 0
            if (FileTest::exist?($ROOT_PATH + "tmp/imap/#{message_id}") == false)
              Dir.mkdir($ROOT_PATH + "tmp/imap/#{message_id}")
            end

            File.open($ROOT_PATH +"tmp/imap/#{message_id}/price.xls", 'wb') do |file|
              file.write(office_attach)
            end

            attach.push($ROOT_PATH + "tmp/imap/#{message_id}/price.xls")
          end

        else
          from = mail_item.header.fields.first.to_s

          subject = mail_item.subject
          date = mail_item.date.to_s
          message_id = mail_item.message_id.to_s
          body =  mail_item.body.decoded.force_encoding(mail_item.charset).encode("UTF-8")
        end

        all_email = Email.all.size

        if all_email > 0
          old_mail = Email.find_by_message_id(message_id)
        else
          old_mail = nil
        end

        if old_mail.nil?
          processing = false

          suppliers = Supplier.all
          supplier = nil

          suppliers.each do |supplier_item|

            # hui = !subject.to_s.mb_chars.downcase.index(supplier_item.subject.to_s.mb_chars.downcase).nil?
            # huz = (supplier_item.email_address.to_s.downcase == from.to_s.downcase)
            # bl9 = (/bsc\.co\.ltd\@yandex\.ru/.match from.to_s.downcase or
            #     /pavel\.osetrov\@me\.com/.match from.to_s.downcase or /pavel\.osetrov\@icloud\.com/.match from.to_s.downcase)
            # suk = attach.size

            if ((supplier_item.email_address.to_s.downcase == from.to_s.downcase) or
                ((!subject.to_s.mb_chars.downcase.index(supplier_item.subject.to_s.mb_chars.downcase).nil?) and (/bsc\.co\.ltd\@yandex\.ru/.match from.to_s.downcase or
                    /pavel\.osetrov\@me\.com/.match from.to_s.downcase or /paulos\@mail\.ru/.match from.to_s.downcase or
                    /pavel\.osetrov\@icloud\.com/.match from.to_s.downcase))) and (attach.size > 0)
              processing = true
              supplier = supplier_item
            end
          end

          if supplier.nil?
            new_mail = Email.new(:subject => subject, :body => body, :message_id => message_id, :from => from, :processing => processing)
          else
            new_mail = Email.new(:subject => subject, :body => body, :message_id => message_id, :from => from, :processing => processing, :supplier_id => supplier.id)
          end

          new_mail.save
          attach.each do |attach_item|
            new_mail.add_attachment(attach_item)
          end

        end

      end

    end
  end

  def shipped



    @mail = Email.new(:subject => 'Что за хуйня', :body => 'Бля')
    @mail.save
  end

end

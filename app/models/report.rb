class Report < ActiveRecord::Base
  belongs_to :user
  belongs_to :product
  belongs_to :catalog

  @@edit_open   = 0
  @@edit_save   = 1
  @@delete      = 2
  @@create_open = 3
  @@create_save = 4

  def self.edit_open
    @@edit_open
  end
  def self.edit_save
    @@edit_save
  end
  def self.delete
    @@delete
  end
  def self.create_open
    @@create_open
  end
  def self.create_save
    @@create_save
  end
  def type_title
    case type_action
      when Report.edit_open
        'Открыл для редактирования'
      when Report.edit_save
        'Изменил'
      when Report.delete
        'Удалил'
      when Report.create_open
        'Начал создавать'
      when Report.create_save
        'Создал'
    end
  end

  def handling_time
    if product.present?
      product_id = product.id
    else
      product_id = nil
    end
    if type_action == Report.edit_open or type_action == Report.edit_save

      # .where("created_at >= :start_date AND created_at <= :end_date",
      #        {start_date: params[:start_date], end_date: params[:end_date]})
      if type_action == Report.edit_open
        open = self
        save = Report.where(product_id: product_id, user_id: user.id, type_action: Report.edit_save)
                      .where("updated_at > :open_date",
                        {open_date: updated_at}).first
      elsif type_action == Report.edit_save
        save = self
        open = Report.where(product_id: product_id, user_id: user.id, type_action: Report.edit_open)
                      .where("updated_at < :open_date",
                             {open_date: updated_at}).last
      end
      # open = Report.where(product_id: product_id, user_id: user.id, type_action: Report.edit_open).last
      # save = Report.where(product_id: product_id, user_id: user.id, type_action: Report.edit_save).last

    elsif type_action == Report.create_open or type_action == Report.create_save

      if type_action == Report.create_open
        open = self
        save = Report.where(product_id: product_id, user_id: user.id, type_action: Report.create_save)
        .where("updated_at > :open_date",
               {open_date: updated_at}).first
      elsif type_action == Report.create_save
        save = self
        open = Report.where(product_id: product_id, user_id: user.id, type_action: Report.create_open)
        .where("updated_at < :open_date",
               {open_date: updated_at}).last
      end

      # open = Report.where(product_id: product_id, user_id: user.id, type_action: Report.edit_open).last
      # save = Report.where(product_id: product_id, user_id: user.id, type_action: Report.edit_save).last
    end
    if open.nil? or save.nil?
      return 0
    end
    hui = save.updated_at - open.updated_at
    hui
  end

end

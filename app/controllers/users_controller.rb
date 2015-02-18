class UsersController < ApplicationController

  include CurrentCart
  include CurrentCompare
  before_action :set_cart
  before_action :set_compare

  before_filter :get_user, :only => [:index, :new, :edit, :update, :orders]
  before_filter :accessible_roles, :only => [:new, :edit, :show, :update, :create]
  load_and_authorize_resource :only => [:show, :new, :destroy, :edit, :update, :orders]

  # GET /users
  # GET /users.xml
  # GET /users.json                                       HTML and AJAX
  #-----------------------------------------------------------------------
  def index
    @users = User.accessible_by(current_ability, :index).limit(20)
    respond_to do |format|
      format.json { render :json => @users }
      format.xml  { render :xml => @users }
      format.html
    end
  end

  # GET /users/new
  # GET /users/new.xml
  # GET /users/new.json                                    HTML AND AJAX
  #-------------------------------------------------------------------
  def new
    @user = User.new
    respond_to do |format|
      format.json { render :json => @user }
      format.xml  { render :xml => @user }
      format.html
    end
  end

  # GET /users/1
  # GET /users/1.xml
  # GET /users/1.json                                     HTML AND AJAX
  #-------------------------------------------------------------------
  def show
    if params[:end].present? and params[:start].present?
      @start = Time.at(params[:start].to_f).utc.beginning_of_day
      @end = Time.at(params[:end].to_f).utc.end_of_day
      @reports_product = Report.where(user_id: @user.id, type_action: [Report.edit_save, Report.create_save], :created_at => (@start..@end)).all #.where.not(product_id: nil).all
    else
      @reports_product = Report.where(user_id: @user.id, type_action: [Report.edit_save, Report.create_save], :created_at => (Time.zone.now.beginning_of_day..Time.zone.now.end_of_day)).all #.where.not(product_id: nil).all
    end
    @reports_product_all_time = Report.where(user_id: @user.id, type_action: [Report.edit_save]).all #.where.not(product_id: nil).all
    respond_to do |format|
      format.json { render :json => @user }
      format.xml  { render :xml => @user }
      format.html
    end

  rescue ActiveRecord::RecordNotFound
    respond_to_not_found(:json, :xml, :html)
  end

  # GET /users/1/edit
  # GET /users/1/edit.xml
  # GET /users/1/edit.json                                HTML AND AJAX
  #-------------------------------------------------------------------
  def edit
    respond_to do |format|
      format.json { render :json => @user }
      format.xml  { render :xml => @user }
      format.html
    end

  rescue ActiveRecord::RecordNotFound
    respond_to_not_found(:json, :xml, :html)
  end

  # DELETE /users/1
  # DELETE /users/1.xml
  # DELETE /users/1.json                                  HTML AND AJAX
  #-------------------------------------------------------------------
  def destroy
    @user.destroy!

    respond_to do |format|
      format.json { respond_to_destroy(:ajax) }
      format.xml  { head :ok }
      format.html { respond_to_destroy(:html) }
    end

  rescue ActiveRecord::RecordNotFound
    respond_to_not_found(:json, :xml, :html)
  end

  # POST /users
  # POST /users.xml
  # POST /users.json                                      HTML AND AJAX
  #-----------------------------------------------------------------
  def create
    @user = User.new(user_params)

    if @user.save
      respond_to do |format|
        format.json { render :json => @user.to_json, :status => 200 }
        format.xml  { head :ok }
        format.html { redirect_to :action => :index }
      end
    else
      respond_to do |format|
        format.json { render :text => "Could not create user", :status => :unprocessable_entity } # placeholder
        format.xml  { head :ok }
        format.html { render :action => :new, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /users/1
  # PUT /users/1.xml
  # PUT /users/1.json                                            HTML AND AJAX
  #----------------------------------------------------------------------------
  def update
    if params[:user][:password].blank?
      [:password,:password_confirmation,:current_password].collect{|p| params[:user].delete(p) }
    else
      @user.errors[:base] << "The password you entered is incorrect" unless @user.valid_password?(params[:user][:current_password])
    end

    respond_to do |format|
      if @user.errors[:base].empty? and @user.update_attributes(user_params)
        flash[:notice] = "Your account has been updated"
        format.json { render :json => @user.to_json, :status => 200 }
        format.xml  { head :ok }
        format.html { render :action => :edit }
      else
        format.json { render :text => "Could not update user", :status => :unprocessable_entity } #placeholder
        format.xml  { render :xml => @user.errors, :status => :unprocessable_entity }
        format.html { render :action => :edit, :status => :unprocessable_entity }
      end
    end

  rescue ActiveRecord::RecordNotFound
    respond_to_not_found(:js, :xml, :html)
  end

  def orders
    @orders = Order.where(:user_id => @current_user.id)
  end

  private

  # Get roles accessible by the current user
  #----------------------------------------------------
  def accessible_roles
    @accessible_roles = Role.accessible_by(current_ability,:read)
  end

  # Make the current user object available to views
  #----------------------------------------
  def get_user
    @current_user = current_user
  end

  def user_params
    params.require(:user).permit(:password,
                                 :password_confirmation,
                                 :current_password,
                                 :role_ids,
                                 :encrypted_password,
                                 :email,
                                 :name,
                                 :phone,
                                 :address,
                                 :InnOrganization,
                                 :NameOrganization
    )
  end

end
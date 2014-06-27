$(function() {
  new Vue({
    el: '#app',
    created: function() {
      var data = this.$data;
      $.get('/api/authinfo', function(result) {
        data.signin = result.signin;
      });
    },
    data: {
      companies: []
    },
    filters: {
      json: function(data, space) {
        return JSON.stringify(data, null, +space);
      }
    },
    methods: {
      fetch: function(url, params) {
        data = this.$data;

        return $.get(url, params)
          .done(function(result) {
            data.previewData = result;
          })
          .fail(function(xhr, status, errorThrown) {
            console.log(arguments);
            data.previewData = { error: errorThrown };
          });
      },
      fetchMe: function() {
        this.fetch('/api/me');
      },
      fetchToken: function() {
        this.fetch('/api/token');
      },
      fetchCompanies: function() {
        var data = this.$data;

        this.fetch('/api/companies').done(function(result) {
          data.companies = result;
        });
      },
      fetchAccountItems: function(company) {
        this.fetch('/api/account_items', { company_id: company.id });
      },
      fetchDeals: function(company) {
        this.fetch('/api/deals', { company_id: company.id });
      },
      fetchItems: function(company) {
        this.fetch('/api/items', { company_id: company.id });
      },
      fetchTaxes: function(company) {
        this.fetch('/api/taxes', { company_id: company.id });
      },
      fetchPartners: function(company) {
        this.fetch('/api/partners', { company_id: company.id });
      },
      fetchTransfers: function(company) {
        this.fetch('/api/transfers', { company_id: company.id });
      },
      fetchWalletables: function(company) {
        this.fetch('/api/walletables', { company_id: company.id }).done(function(result) {
          console.log('walletables', result);
          company.walletables = result;
        });
      },
      fetchWalletTxns: function(company, walletable) {
        var params = {
          company_id: company.id,
          walletable_type: walletable.type,
          walletable_id: walletable.id
        };

        this.fetch('/api/wallet_txns', params, function(result) {
          console.log(result);
        });
      }
    }
  });

});

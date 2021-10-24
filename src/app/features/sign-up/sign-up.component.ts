import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { DialogData, MessageDialogComponent } from 'src/app/shared/message-dialog/message-dialog.component';

function validateDateOfBirth() {
  return (control: FormControl) => {
    const dateNow = moment();
    const controlDate = moment(control.value);
    if((controlDate < dateNow) && dateNow.diff(controlDate, 'years') > 17) {
      return null;
    }
    
    return { invalidDate: true };
  };
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  userRegisterationForm: FormGroup;
  accountTypes: string[];
  noOfIndividuals: number[];
  noOfCompanyOfficers: number[];
  salutations: string[];

  accountName: AbstractControl;
  bankAccountNumber: AbstractControl;
  bankAccountBSB: AbstractControl;

  get accountType() {
    return this.userRegisterationForm.get('accountType');
  }

  get numberOfIndividuals() {
    return this.userRegisterationForm.get('numberOfIndividuals');
  }

  get individualDetails() {
    return this.userRegisterationForm.get('individualDetails') as FormArray;
  }

  get personalAccountDetails() {
    return this.userRegisterationForm.get('personalAccountDetails');
  }

  get accountHolderFirstName() {
    return this.userRegisterationForm.get('personalAccountDetails')?.get('accountHolderFirstName');
  }

  get accountHolderLastName() {
    return this.userRegisterationForm.get('personalAccountDetails')?.get('accountHolderLastName');
  }

  get tfn() {
    return this.userRegisterationForm.get('personalAccountDetails')?.get('tfn');
  }

  get corporateAccountDetails() {
    return this.userRegisterationForm.get('corporateAccountDetails');
  }

  get companyName() {
    return this.userRegisterationForm.get('corporateAccountDetails')?.get('companyName');
  }

  get abn() {
    return this.userRegisterationForm.get('corporateAccountDetails')?.get('abn');
  }

  get numberOfCompanyOfficers() {
    return this.userRegisterationForm.get('corporateAccountDetails')?.get('numberOfCompanyOfficers');
  }

  get companyOfficerDetails() {
    return this.userRegisterationForm.get('corporateAccountDetails')?.get('companyOfficerDetails') as FormArray;
  }

  constructor(private formBuilder: FormBuilder,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.userRegisterationForm = this.formBuilder.group({
      accountType: ['', Validators.required],
      numberOfIndividuals: ['', Validators.required],
      individualDetails: this.formBuilder.array([])
    });

    // Ideally 'accountTypes' should come from API
    this.accountTypes = ['Personal', 'Corporate'];

    // Ideally 'noOfIndividuals' should come from API
    this.noOfIndividuals = [1, 2, 3, 4, 5, 6];

    // Ideally 'salutations' should come from API
    this.salutations = ['Mr', 'Mrs', 'Miss', 'Ms'];

    // Ideally 'noOfCompanyOfficers' should come from API
    this.noOfCompanyOfficers = [1, 2, 3, 4, 5, 6];
  }

  onAccountTypeChange() {
    switch (this.accountType?.value) {
      case 'Personal': {
        this.userRegisterationForm.addControl('personalAccountDetails', this.formBuilder.group({
          accountName: ['', Validators.required],
          accountHolderFirstName: ['', Validators.required],
          accountHolderLastName: ['', Validators.required],
          tfn: ['', Validators.required],
          bankAccountNumber: ['',
            [Validators.required, Validators.pattern('^[0-9]{8}$')]],
          bankAccountBSB: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]]
        }))

        this.accountName = this.userRegisterationForm.get('personalAccountDetails')?.get('accountName') as AbstractControl;
        this.bankAccountNumber = this.userRegisterationForm.get('personalAccountDetails')?.get('bankAccountNumber') as AbstractControl;
        this.bankAccountBSB = this.userRegisterationForm.get('personalAccountDetails')?.get('bankAccountBSB') as AbstractControl;
        break;
      }
      case 'Corporate': {
        this.userRegisterationForm.addControl('corporateAccountDetails', this.formBuilder.group({
          accountName: ['', Validators.required],
          companyName: ['', Validators.required],
          abn: ['', Validators.required],
          bankAccountNumber: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
          bankAccountBSB: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
          numberOfCompanyOfficers: ['', Validators.required],
          companyOfficerDetails: this.formBuilder.array([])
        }))

        this.accountName = this.userRegisterationForm.get('corporateAccountDetails')?.get('accountName') as AbstractControl;
        this.bankAccountNumber = this.userRegisterationForm.get('corporateAccountDetails')?.get('bankAccountNumber') as AbstractControl;
        this.bankAccountBSB = this.userRegisterationForm.get('corporateAccountDetails')?.get('bankAccountBSB') as AbstractControl;
        break;
      }
    }
  }

  onNumberOfIndividualChange() {
    this.addIndividualDetails();
  }

  onNumberOfCompanyOfficersChange() {
    this.addCompanyOfficerDetails();
  }

  addIndividualDetails() {
    this.individualDetails.clear();

    for (let i = this.numberOfIndividuals?.value; i > 0; i--) {
      const basicDetails = this.formBuilder.group({
        salutation: ['', Validators.required],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        dateOfBirth: ['', [Validators.required, validateDateOfBirth()]]
      })

      this.individualDetails.push(basicDetails);
    }
  }

  addCompanyOfficerDetails() {
    this.companyOfficerDetails.clear();

    for (let i = this.numberOfCompanyOfficers?.value; i > 0; i--) {
      const basicDetails = this.formBuilder.group({
        salutation: ['', Validators.required],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required]
      })

      this.companyOfficerDetails.push(basicDetails);
    }
  }

  onRegister() {
    this.showMessageDialog();
  }

  showMessageDialog() {
    const dialogData: DialogData = {
      message: 'Registeration completed successfully'
    }
    this.dialog.open(MessageDialogComponent, { 
      data: dialogData
    });
  }

}

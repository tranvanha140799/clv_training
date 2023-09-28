import {
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsUppercase,
  MaxLength,
} from 'class-validator';

export class VesselDTO {
  // @PrimaryColumn({ name: 'vsl_cd' })
  @IsNotEmpty()
  @IsUppercase()
  @MaxLength(4)
  vslCd: string;

  // @Column({ name: 'vsl_clss_flg', default: 'N', nullable: true })
  @IsNotEmpty()
  @MaxLength(1)
  vslClssFlg: string;

  // @Column({ name: 'vsl_eng_nm', nullable: true })
  @IsNotEmpty()
  @MaxLength(50)
  vslEngNm: string;

  // @Column({ name: 'vsl_locl_nm', nullable: true })
  @MaxLength(50)
  vslLoclNm: string;

  // @Column({
  //   name: 'foil_capa',
  //   type: 'numeric',
  //   precision: 18,
  //   scale: 3,
  //   nullable: true,
  // })
  @IsNumber()
  foilCapa: number;

  // @Column({
  //   name: 'doil_capa',
  //   type: 'numeric',
  //   precision: 18,
  //   scale: 3,
  //   nullable: true,
  // })
  @IsNumber()
  doilCapa: number;

  // @Column({
  //   name: 'frsh_wtr_capa',
  //   type: 'numeric',
  //   precision: 18,
  //   scale: 3,
  //   nullable: true,
  // })
  @IsNumber()
  frshWtrCapa: number;

  // @Column({ name: 'call_sgn_no', nullable: true })
  @MaxLength(15)
  callSgnNo: string;

  // @Column({ name: 'rgst_no', nullable: true })
  @MaxLength(15)
  rgstNo: string;

  // @Column({ name: 'phn_no', nullable: true })
  @MaxLength(20)
  phnNo: string;

  // @Column({ name: 'fax_no', nullable: true })
  @MaxLength(20)
  faxNo: string;

  // @Column({ name: 'tlx_no', nullable: true })
  @MaxLength(20)
  tlxNo: string;

  // @Column({ name: 'vsl_eml', nullable: true })
  // @IsEmail()
  @IsEmpty()
  vslEml: string;

  // @Column({ name: 'piclb_desc', nullable: true })
  @MaxLength(100)
  piclbDesc: string;

  // @Column({ name: 'rgst_port_cd', nullable: true })
  @MaxLength(5)
  rgstPortCd: string;

  // @Column({ name: 'clss_no_rgst_area_nm', nullable: true })
  clssNoRgstAreaNm: string;

  // @Column({ name: 'vsl_clss_no', nullable: true })
  @MaxLength(10)
  vslClssNo: string;

  // @Column({ name: 'vsl_bldr_nm', nullable: true })
  vslBldrNm: string;

  // @Column({
  //   name: 'loa_len',
  //   type: 'numeric',
  //   precision: 7,
  //   scale: 2,
  //   nullable: true,
  // })
  loaLen: number;

  // @Column({
  //   name: 'lbp_len',
  //   type: 'numeric',
  //   precision: 7,
  //   scale: 2,
  //   nullable: true,
  // })
  lbpLen: number;

  // @Column({
  //   name: 'vsl_wdt',
  //   type: 'numeric',
  //   precision: 7,
  //   scale: 2,
  //   nullable: true,
  // })
  vslWdt: number;

  // @Column({
  //   name: 'vsl_dpth',
  //   type: 'numeric',
  //   precision: 6,
  //   scale: 3,
  //   nullable: true,
  // })
  vslDpth: number;

  // @Column({
  //   name: 'smr_drft_hgt',
  //   type: 'numeric',
  //   precision: 8,
  //   scale: 3,
  //   nullable: true,
  // })
  smrDrftHgt: number;

  // @Column({
  //   name: 'dwt_wgt',
  //   type: 'numeric',
  //   precision: 9,
  //   scale: 3,
  //   nullable: true,
  // })
  dwtWgt: number;

  // @Column({
  //   name: 'lgt_shp_tong_wgt',
  //   type: 'numeric',
  //   precision: 9,
  //   scale: 3,
  //   nullable: true,
  // })
  lgtShpTongWgt: number;

  // @Column({
  //   name: 'grs_rgst_tong_wgt',
  //   type: 'numeric',
  //   precision: 9,
  //   scale: 3,
  //   nullable: true,
  // })
  grsRgstTongWgt: number;

  // @Column({
  //   name: 'net_rgst_tong_wgt',
  //   type: 'numeric',
  //   precision: 9,
  //   scale: 3,
  //   nullable: true,
  // })
  netRgstTongWgt: number;

  // @Column({
  //   name: 'pnm_gt_wgt',
  //   type: 'numeric',
  //   precision: 9,
  //   scale: 3,
  //   nullable: true,
  // })
  pnmGtWgt: number;

  // @Column({
  //   name: 'pnm_net_tong_wgt',
  //   type: 'numeric',
  //   precision: 9,
  //   scale: 3,
  //   nullable: true,
  // })
  pnmNetTongWgt: number;

  // @Column({
  //   name: 'suz_gt_wgt',
  //   type: 'numeric',
  //   precision: 9,
  //   scale: 3,
  //   nullable: true,
  // })
  suzGtWgt: number;

  // @Column({
  //   name: 'suz_net_tong_wgt',
  //   type: 'numeric',
  //   precision: 9,
  //   scale: 3,
  //   nullable: true,
  // })
  suzNetTongWgt: number;

  // @Column({ name: 'mn_eng_mkr_nm', nullable: true })
  mnEngMkrNm: string;

  // @Column({ name: 'mn_eng_tp_desc', nullable: true })
  @MaxLength(100)
  mnEngTpDesc: string;

  // @Column({
  //   name: 'mn_eng_bhp_pwr',
  //   type: 'numeric',
  //   precision: 6,
  //   nullable: true,
  // })
  mnEngBhpPwr: number;

  // @Column({ name: 'vsl_own_ind_cd', nullable: true })
  @MaxLength(1)
  vslOwnIndCd: string;

  // @Column({ name: 'vsl_rgst_cnt_cd', nullable: true })
  @MaxLength(2)
  vslRgstCntCd: string;

  // @Column({ name: 'vsl_bld_cd', nullable: true })
  @MaxLength(1)
  vslBldCd: string;

  // @Column({ name: 'crr_cd', nullable: true })
  @MaxLength(3)
  crrCd: string;

  // @Column({ name: 'fdr_div_cd', nullable: true })
  @MaxLength(1)
  fdrDivCd: string;

  // @Column({
  //   name: 'vsl_svc_spd',
  //   type: 'numeric',
  //   precision: 5,
  //   scale: 3,
  //   nullable: true,
  // })
  vslSvcSpd: number;

  // @Column({
  //   name: 'max_spd',
  //   type: 'numeric',
  //   precision: 5,
  //   scale: 3,
  //   nullable: true,
  // })
  maxSpd: number;

  // @Column({
  //   name: 'ecn_spd',
  //   type: 'numeric',
  //   precision: 5,
  //   scale: 3,
  //   nullable: true,
  // })
  ecnSpd: number;

  // @Column({ name: 'crw_knt', type: 'numeric', precision: 5, nullable: true })
  crwKnt: number;

  // @Column({
  //   name: 'cntr_dzn_capa',
  //   type: 'numeric',
  //   precision: 18,
  //   scale: 3,
  //   nullable: true,
  // })
  cntrDznCapa: number;

  // @Column({
  //   name: 'cntr_op_capa',
  //   type: 'numeric',
  //   precision: 18,
  //   scale: 3,
  //   nullable: true,
  // })
  cntrOpCapa: number;

  // @Column({
  //   name: 'cntr_pnm_capa',
  //   type: 'numeric',
  //   precision: 18,
  //   scale: 3,
  //   nullable: true,
  // })
  cntrPnmCapa: number;

  // @Column({
  //   name: 'cntr_vsl_clss_capa',
  //   type: 'numeric',
  //   precision: 18,
  //   scale: 3,
  //   nullable: true,
  // })
  cntrVslClssCapa: number;

  // @Column({
  //   name: 'rf_rcpt_knt',
  //   type: 'numeric',
  //   precision: 5,
  //   nullable: true,
  // })
  rfRcptKnt: number;

  // @Column({
  //   name: 'rf_rcpt_max_knt',
  //   type: 'numeric',
  //   precision: 5,
  //   nullable: true,
  // })
  rfRcptMaxKnt: number;

  // @Column({
  //   name: 'fbd_capa',
  //   type: 'numeric',
  //   precision: 18,
  //   scale: 3,
  //   nullable: true,
  // })
  fbdCapa: number;

  // @Column({
  //   name: 'dpl_capa',
  //   type: 'numeric',
  //   precision: 18,
  //   scale: 3,
  //   nullable: true,
  // })
  dplCapa: number;

  // @Column({
  //   name: 'blst_tnk_capa',
  //   type: 'numeric',
  //   precision: 18,
  //   scale: 3,
  //   nullable: true,
  // })
  blstTnkCapa: number;

  // @Column({
  //   name: 'foil_csm',
  //   type: 'numeric',
  //   precision: 8,
  //   scale: 4,
  //   nullable: true,
  // })
  foilCsm: number;

  // @Column({
  //   name: 'doil_csm',
  //   type: 'numeric',
  //   precision: 8,
  //   scale: 4,
  //   nullable: true,
  // })
  doilCsm: number;

  // @Column({
  //   name: 'frsh_wtr_csm',
  //   type: 'numeric',
  //   precision: 8,
  //   scale: 4,
  //   nullable: true,
  // })
  frshWtrCsm: number;

  // @Column({
  //   name: 'mn_eng_rpm_pwr',
  //   type: 'numeric',
  //   precision: 6,
  //   nullable: true,
  // })
  mnEngRpmPwr: number;

  // @Column({
  //   name: 'gnr_rpm_pwr',
  //   type: 'numeric',
  //   precision: 6,
  //   nullable: true,
  // })
  gnrRpmPwr: number;

  // @Column({
  //   name: 'vsl_hgt',
  //   type: 'numeric',
  //   precision: 8,
  //   scale: 3,
  //   nullable: true,
  // })
  vslHgt: number;

  // @Column({ name: 'rgst_dt', type: 'date', nullable: true })
  rgstDt: Date;

  // @Column({ name: 'vsl_edi_nm', nullable: true })
  @MaxLength(50)
  vslEdiNm: string;

  // @Column({ name: 'co_cd', nullable: true })
  @MaxLength(1)
  coCd: string;

  // @Column({ name: 'vsl_clz_dt', nullable: true })
  @MaxLength(8)
  vslClzDt: string;

  // @Column({ name: 'vsl_cre_ofc_cd', nullable: true })
  @MaxLength(6)
  vslCreOfcCd: string;

  // @Column({ name: 'vsl_delt_ofc_cd', nullable: true })
  @MaxLength(6)
  vslDeltOfcCd: string;

  // @Column({ name: 'vsl_bld_area_nm', nullable: true, length: 500 })
  vslBldAreaNm: string;

  // @Column({ name: 'gnr_mkr_nm', nullable: true })
  @MaxLength(50)
  gnrMkrNm: string;

  // @Column({ name: 'gnr_tp_desc', nullable: true })
  gnrTpDesc: string;

  // @Column({
  //   name: 'gnr_bhp_pwr',
  //   type: 'numeric',
  //   precision: 6,
  //   nullable: true,
  // })
  gnrBhpPwr: number;

  // @Column({ name: 'bwthst_mkr_nm', nullable: true })
  @MaxLength(50)
  bwthstMkrNm: string;

  // @Column({ name: 'bwthst_tp_desc', nullable: true })
  bwthstTpDesc: string;

  // @Column({
  //   name: 'bwthst_bhp_pwr',
  //   type: 'numeric',
  //   precision: 6,
  //   nullable: true,
  // })
  bwthstBhpPwr: number;

  // @Column({
  //   name: 'bwthst_rpm_pwr',
  //   type: 'numeric',
  //   precision: 6,
  //   nullable: true,
  // })
  bwthstRpmPwr: number;

  // @Column({ name: 'lloyd_no', nullable: true })
  @MaxLength(20)
  lloydNo: string;

  // @Column({ name: 'vsl_lnch_dt', type: 'date', nullable: true })
  vslLnchDt: Date;

  // @Column({ name: 'vsl_de_dt', type: 'date', nullable: true })
  vslDeDt: Date;

  // @Column({ name: 'vsl_kel_ly_dt', type: 'date', nullable: true })
  vslKelLyDt: Date;

  // @Column({ name: 'vsl_hl_no', nullable: true })
  @MaxLength(15)
  vslHlNo: string;

  // @Column({
  //   name: 'ttl_teu_knt',
  //   type: 'numeric',
  //   precision: 18,
  //   scale: 5,
  //   nullable: true,
  // })
  ttlTeuKnt: number;

  // @Column({
  //   name: 'vsl_htch_knt',
  //   type: 'numeric',
  //   precision: 5,
  //   nullable: true,
  // })
  vslHtchKnt: number;

  // @Column({
  //   name: 'vsl_hld_knt',
  //   type: 'numeric',
  //   precision: 5,
  //   nullable: true,
  // })
  vslHldKnt: number;

  // @Column({ name: 'vsl_rmk', nullable: true, length: 1000 })
  vslRmk: string;

  // @Column({ name: 'intl_tong_certi_flg', nullable: true })
  intlTongCertiFlg: string;

  // @Column({
  //   name: 'madn_voy_suz_net_tong_wgt',
  //   type: 'numeric',
  //   precision: 9,
  //   scale: 3,
  //   nullable: true,
  // })
  madnVoySuzNetTongWgt: number;

  // @Column({ name: 'vsl_sft_cstru_certi_exp_dt', type: 'date', nullable: true })
  vslSftCstruCertiExpDt: Date;

  // @Column({ name: 'vsl_sft_rdo_certi_exp_dt', type: 'date', nullable: true })
  vslSftRdoCertiExpDt: Date;

  // @Column({ name: 'vsl_sft_eq_certi_exp_dt', type: 'date', nullable: true })
  vslSftEqCertiExpDt: Date;

  // @Column({ name: 'vsl_lod_line_certi_exp_dt', type: 'date', nullable: true })
  vslLodLineCertiExpDt: Date;

  // @Column({ name: 'vsl_derat_certi_exp_dt', type: 'date', nullable: true })
  vslDeratCertiExpDt: Date;

  // @Column({ name: 'cre_usr_id', length: 100, nullable: false })
  @IsNotEmpty()
  creUsrId: string;

  // @CreateDateColumn({ name: 'cre_dt' })
  @IsNotEmpty()
  creDt: Date;

  // @Column({ name: 'upd_usr_id', length: 100, nullable: false })
  @IsNotEmpty()
  updUsrId: string;

  // @UpdateDateColumn({ name: 'upd_dt' })
  @IsNotEmpty()
  updDt: Date;

  // @Column({ name: 'delt_flg', default: 'N' })
  @MaxLength(1)
  deltFlg: string;

  // @Column({ name: 'eai_evnt_dt', type: 'date', nullable: true })
  eaiEvntDt: Date;

  // @Column({ name: 'eai_if_id', length: 32, nullable: true })
  eaiIfId: string;

  // @Column({ name: 'modi_vsl_cd', length: 30, nullable: true })
  @MaxLength(30)
  modiVslCd: string;

  // @Column({ name: 'edw_upd_dt', type: 'date', nullable: true })
  edwUpdDt: Date;

  // @Column({ name: 'modi_vsl_opr_tp_cd', length: 30, nullable: true })
  modiVslOprTpCd: string;

  // @Column({ name: 'modi_ownr_nm', length: 50, nullable: true })
  modiOwnrNm: string;

  // @Column({ name: 'modi_alln_vsl_cd', length: 6, nullable: true })
  @MaxLength(6)
  modiAllnVslCd: string;

  // @Column({ name: 'lgcy_co_cd', length: 1, nullable: true })
  @MaxLength(1)
  lgcyCoCd: string;

  // @Column({ name: 'nyk_lgcy_vsl_cd_ctnt', length: 10, nullable: true })
  @MaxLength(10)
  nykLgcyVslCdCtnt: string;

  // @Column({ name: 'mol_lgcy_vsl_cd_ctnt', length: 10, nullable: true })
  @MaxLength(10)
  molLgcyVslCdCtnt: string;

  // @Column({ name: 'kline_lgcy_vsl_cd_ctnt', length: 10, nullable: true })
  @MaxLength(10)
  klineLgcyVslCdCtnt: string;
}
